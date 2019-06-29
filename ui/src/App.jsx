import React from 'react';
import { Provider } from 'react-redux';
import store from './store'
import MainRouter from './containers/MainRouter';
import './App.css';

export default function App() {
  return (
    <Provider store={store}>
      <MainRouter />
    </Provider>
  );
}
