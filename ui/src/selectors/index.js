import { createSelector } from 'reselect';

export const getUserName = state => state.user.name;
export const getUserLoginState = state => state.user.process.state;

export const getMessages = state => state.messages.value;
export const getMessagesFetchState = state => state.messages.process.state;

export const getFirstMessage = createSelector(
  getMessages,
  messages => {
    return messages[0];
  }
);
