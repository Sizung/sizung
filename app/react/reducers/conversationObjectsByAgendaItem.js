import { FETCH_CONVERSATION_OBJECTS } from '../actions/conversationObjects.js';
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import * as constants from '../actions/constants';
import { setReference, updateReference, setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByAgendaItem(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'agendaItems');
    case CREATE_COMMENT: return setCommentReference(state, action, 'agendaItems');
    case DELETE_COMMENT: return deleteCommentReference(state, action, 'agendaItems');
    case constants.CREATE_DELIVERABLE: return setReference(state, action, 'deliverable', 'agendaItemId');
    case constants.UPDATE_DELIVERABLE: return updateReference(state, action, 'deliverable', 'agendaItemId');
    default: return state;
  }
}
