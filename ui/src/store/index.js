import {
  compose,
  applyMiddleware,
  createStore,
} from 'redux';
import createSagaMiddleWare from 'redux-saga';
import rootReducer from '../reducers'
import rootSaga from '../sagas';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleWare = createSagaMiddleWare();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleWare)),
);

sagaMiddleWare.run(rootSaga);

export default store;
