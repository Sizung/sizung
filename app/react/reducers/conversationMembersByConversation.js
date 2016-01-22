import { CREATE_CONVERSATION_MEMBER, DELETE_CONVERSATION_MEMBER } from '../actions/conversationMembers';
import { CONVERSATION } from '../actions/conversations';
import { setReference, removeReference } from '../utils/reducerUtils';
import { fetched } from '../utils/paginationUtils';
import Immutable from 'immutable';

const initialState = new Immutable.Map();

export default function conversationMembersByConversation(state = initialState, action = null) {
  switch (action.type) {
    case CONVERSATION:
      return fetched(state, action.entity.id, action.conversationMembers, {});
    case CREATE_CONVERSATION_MEMBER: return setReference(state, action, 'conversationMember', 'conversationId');
    case DELETE_CONVERSATION_MEMBER: return removeReference(state, action, 'conversationMember', 'conversationId');
    default: return state;
  }
}
