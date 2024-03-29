import Immutable from 'immutable';
import * as constants from '../actions/constants';
import { setReference, removeReference } from '../utils/reducerUtils';
import { fetched, fetchedReset } from '../utils/paginationUtils';

const initialState = new Immutable.Map();

export default function conversationMembersByConversation(state = initialState, action = null) {
  switch (action.type) {
    case constants.CONVERSATION:
    case constants.UPDATE_CONVERSATION:
      return fetchedReset(state, action.entity.id, action.conversationMembers, {});
    case constants.CREATE_CONVERSATION_MEMBER: return setReference(state, action, 'conversationMember', 'conversationId');
    case constants.DELETE_CONVERSATION_MEMBER: return removeReference(state, action, 'conversationMember', 'conversationId');
    default: return state;
  }
}
