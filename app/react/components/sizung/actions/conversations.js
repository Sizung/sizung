export const SET_CURRENT_CONVERSATION = 'SET_CONVERSATION';

export function setCurrentConversation(conversation) {
  return {
    type: SET_CURRENT_CONVERSATION,
    conversation: conversation
  };
}
