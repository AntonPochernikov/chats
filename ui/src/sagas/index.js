import { all, take, put, call, fork, race, select } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import axios from 'axios';
import * as actions from '../actions';
import * as selectors from '../selectors';
import delay from '../libs/delay'

function* loginFlow() {
  while (true) {
    const { payload: { user } } = yield take('USER/LOGIN/REQUEST');
    try {
      yield call(delay, 500);
      yield put(actions.loginUserSuccess({ user }));
    } catch (e) {
      yield put(actions.loginUserFailure({ error: e }));
    }
    yield take('USER/LOGOUT');
  }
}

function* fetchMessages() {
  while (true) {
    yield take('MESSAGE/LIST/FETCH/REQUEST');
    const first = yield select(selectors.getFirstMessage);
    const params = first ? { id: first.id } : {}
    try {
      const [{ data }] = yield all([
        call(axios.get, 'http://localhost:8081/messages', { params }),
        call(delay, 500),
      ]);
      yield put(actions.fetchMessagesSuccess({ messages: data }));

      if (!first) {
        yield fork(watchSocket);
      }
    } catch (e) {
      yield put(actions.fetchMessagesFailure({ error: e }));
    }
  }
}

// channel with socker events emitter
function createSocketChannel(socket) {
  return eventChannel((emitter) => {
    socket.onopen = () => {
      console.log('Socket connected');
    };
    socket.onmessage = (e) => {
      emitter(e.data);
    };
    socket.onclose = () => {
      emitter(END);
    };
    socket.onerror = (err) => {
      console.log(err);
      emitter(err);
    };
    return () => {
      socket.close();
    };
  });
}

export function* watchSocket() {
  const socket = new WebSocket('ws://localhost:8081/messages');
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    try {
      const { channelMessage, userMessage, logout } = yield race({
        channelMessage: take(socketChannel),
        userMessage: take('SOCKET/MESSAGE/SEND'),
        logout: take('USER/LOGOUT'),
      });
      if (logout) {
        socketChannel.close();
        return;
      }
      if (channelMessage) {
        yield put(actions.getSocketMessage({ message: JSON.parse(channelMessage) }));
      } else {
        const userName = yield select(selectors.getUserName);
        socket.send(JSON.stringify({
          user: userName,
          message: userMessage.payload.message,
          ts: new Date().toISOString(),
        }));
      }
    } catch(err) {
      console.error('socket error:', err);
      socketChannel.close();
    }
  }
}

export default function* rootSaga() {
  yield all([
    call(loginFlow),
    call(fetchMessages),
  ]);
}
