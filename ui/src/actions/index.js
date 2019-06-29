import { createAction } from 'redux-actions';

export const loginUserRequest = createAction('USER/LOGIN/REQUEST');
export const loginUserSuccess = createAction('USER/LOGIN/SUCCESS');
export const loginUserFailure = createAction('USER/LOGIN/FAILURE');
export const logoutUser = createAction('USER/LOGOUT');

export const fetchMessagesRequest = createAction('MESSAGE/LIST/FETCH/REQUEST');
export const fetchMessagesSuccess = createAction('MESSAGE/LIST/FETCH/SUCCESS');
export const fetchMessagesFailure = createAction('MESSAGE/LIST/FETCH/FAILURE');

export const getSocketMessage = createAction('SOCKET/MESSAGE/GET');
export const sendSocketMessage = createAction('SOCKET/MESSAGE/SEND');
