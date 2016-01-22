import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_CONVERSATION_MEMBERS, CREATE_CONVERSATION_MEMBER } from '../actions/conversationMembers';
import { setObject, setObjects, setReference, setCommentReference, deleteCommentReference, handleFetchConversationObjects } from '../utils/reducerUtils';
import { toReference, fetched } from '../utils/paginationUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationMembersByConversation(state = initialState, action = null) {
  switch (action.type) {
    case SET_CONVERSATION_MEMBERS:
      const objects = action.conversationMembers.map(toReference);
      return fetched(state, action.conversationId, objects, action);
    case CREATE_CONVERSATION_MEMBER: return setReference(state, action, 'conversationMember', 'conversationId');
    default: return state;
  }
}
