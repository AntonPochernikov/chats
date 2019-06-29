import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as action from '../actions'

const userInit = {
  name: null,
  process: {
    state: 'initial',
    error: null,
  },
}
const user = handleActions({
  [action.loginUserRequest]: () => ({
    name: null,
    process: {
      state: 'requested',
      error: null,
    },
  }),
  [action.loginUserSuccess]: (state, { payload: { user } }) => ({
    name: user,
    process: {
      state: 'succeed',
      error: null,
    },
  }),
  [action.loginUserFailure]: (state, { payload: { error } }) => ({
    name: null,
    process: {
      state: 'failed',
      error,
    },
  }),
  [action.logoutUser]: () => userInit,
}, userInit);

const messagesInit = {
  value: [],
  process: {
    state: 'initial',
    error: null,
  },
}
const messages = handleActions({
  [action.fetchMessagesRequest]: state => ({
    ...state,
    process: {
      state: state.value.length === 0 ? 'requested' : 'loadingMore',
      error: null,
    },
  }),
  [action.fetchMessagesSuccess]: (state, { payload: { messages } }) => ({
    value: messages.concat(state.value),
    process: {
      state: 'succeed',
      error: null,
    },
  }),
  [action.fetchMessagesFailure]: (state, { payload: { error } }) => ({
    value: [],
    process: {
      state: 'failed',
      error,
    },
  }),
  [action.getSocketMessage]: (state, { payload: { message } }) => ({
    ...state,
    value: state.value.concat(message),
  }),
  [action.logoutUser]: () => messagesInit,
}, messagesInit);

export default combineReducers({
  user,
  messages,
});
