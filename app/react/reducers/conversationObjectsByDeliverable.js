import Immutable from 'immutable';
import * as constants from '../actions/constants';
import { setCommentReference, deleteCommentReference, handleFetchConversationObjects, setReference } from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function conversationObjectsByDeliverable(state = initialState, action = null) {
  switch (action.type) {
    case constants.FETCH_CONVERSATION_OBJECTS: return handleFetchConversationObjects(state, action, 'deliverables');
    case constants.CREATE_COMMENT: return setCommentReference(state, action, 'deliverables');
    case constants.DELETE_COMMENT: return deleteCommentReference(state, action, 'deliverables');
    case constants.CREATE_ATTACHMENT: return setReference(state, action, 'attachment', 'parentId');
    default: return state;
  }
}
