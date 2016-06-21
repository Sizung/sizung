import Immutable from 'immutable';
import * as constants from '../actions/constants';
import { setReference, updateReference, setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';

const initialState = Immutable.Map();

export default function conversationObjectsByAgendaItem(state = initialState, action = null) {
  switch (action.type) {
    case constants.FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'agendaItems');
    case constants.CREATE_COMMENT: return setCommentReference(state, action, 'agendaItems');
    case constants.DELETE_COMMENT: return deleteCommentReference(state, action, 'agendaItems');
    case constants.CREATE_DELIVERABLE: return setReference(state, action, 'deliverable', 'agendaItemId');
    case constants.UPDATE_DELIVERABLE: return updateReference(state, action, 'deliverable', 'agendaItemId');
    case constants.CREATE_ATTACHMENT: return setReference(state, action, 'attachment', 'parentId');
    case constants.UPDATE_ATTACHMENT: return updateReference(state, action, 'attachment', 'parentId');
    default: return state;
  }
}
