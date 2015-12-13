import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';
export const SET_CURRENT_CONVERSATION = 'SET_CONVERSATION';

export function setCurrentConversation(conversation) {
  return {
    type: SET_CURRENT_CONVERSATION,
    status: STATUS_SUCCESS,
    conversation: conversation
  };
}
