import * as constants from '../actions/constants';
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = new Immutable.Map();

export default function conversationObjectsByDeliverable(state = initialState, action = null) {
  switch (action.type) {
    case constants.FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'deliverables');
    case CREATE_COMMENT: return setCommentReference(state, action, 'deliverables');
    case DELETE_COMMENT: return deleteCommentReference(state, action, 'deliverables');
    default: return state;
  }
}
