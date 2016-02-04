import * as constants from '../actions/constants';
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { setReference, setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByConversation(state = initialState, action = null) {
  switch (action.type) {
    case constants.FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'conversations');
    case DELETE_COMMENT: return deleteCommentReference(state, action, 'conversations');
    case CREATE_COMMENT: return setCommentReference(state, action, 'conversations');
    case constants.CREATE_AGENDA_ITEM: return setReference(state, action, 'agendaItem', 'conversationId');
    default: return state;
  }
}
