import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/conversationObjects.js';
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { CREATE_AGENDA_ITEM } from '../actions/agendaItems';
import { setObject, setObjects, setReference, setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByConversation(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'conversations');
    case DELETE_COMMENT: return deleteCommentReference(state, action, 'conversations');
    case CREATE_COMMENT: return setCommentReference(state, action, 'conversations');
    case CREATE_AGENDA_ITEM: return setReference(state, action, 'agendaItem', 'conversationId');
    default: return state;
  }
}
