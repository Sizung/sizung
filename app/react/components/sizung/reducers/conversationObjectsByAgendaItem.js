import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/conversationObjects.js'
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { CREATE_DELIVERABLE, UPDATE_DELIVERABLE } from '../actions/deliverables';
import { setObject, setObjects, setReference, updateReference, setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByAgendaItem(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'agendaItems');
    case CREATE_COMMENT: return setCommentReference(state, action, 'agendaItems');
    case DELETE_COMMENT: return deleteCommentReference(state, action, 'agendaItems');
    case CREATE_DELIVERABLE: return setReference(state, action, 'deliverable', 'agendaItemId');
    case UPDATE_DELIVERABLE: return updateReference(state, action, 'deliverable', 'agendaItemId');
    default: return state;
  }
}
