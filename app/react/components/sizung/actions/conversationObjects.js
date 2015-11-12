import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses';
import { transformConversationObjectFromJsonApi } from '../utils/jsonApiUtils.js';

export const SET_CONVERSATION_OBJECTS = 'SET_CONVERSATION_OBJECTS';

export function setConversationObjects(conversation, conversationObjects) {
  return {
    type: SET_CONVERSATION_OBJECTS,
    conversation: conversation,
    conversationObjects: conversationObjects.data.map(transformConversationObjectFromJsonApi)
  };
}
