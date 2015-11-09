import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses';
import { transformCommentFromJsonApi } from './comments';
import { transformAgendaItemFromJsonApi } from './agendaItems';

export const SET_CONVERSATION_OBJECTS = 'SET_CONVERSATION_OBJECTS';

export function transformConversationObjectFromJsonApi(conversationObject) {
  if (conversationObject.type === 'comments') {
    return transformCommentFromJsonApi(conversationObject);
  }
  else if  (conversationObject.type === 'agenda_items') {
    return transformAgendaItemFromJsonApi(conversationObject);
  }
  else {
    console.log('Unknown type of ConversationObject to transform: ', conversationObject);
  }
}

export function setConversationObjects(conversation, conversationObjects) {
  return {
    type: SET_CONVERSATION_OBJECTS,
    conversation: conversation,
    conversationObjects: conversationObjects.data.map(transformConversationObjectFromJsonApi)
  };
}
