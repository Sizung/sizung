import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.Map({ showConversationMembers: false });

export default function currentConversationMembersVisibility(state = initialState, action = null) {
  switch (action.type) {
    case constants.TOGGLE_CONVERSATION_MEMBERS:
      return new Immutable.Map({ showConversationMembers: action.toggle });
    default: return state;
  }
}
