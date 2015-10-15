import { SET_CURRENT_CONVERSATION } from '../actions/conversations';

export default function conversations(state = {}, action = null) {
  switch (action.type) {
  case SET_CURRENT_CONVERSATION:
    return {currentConversation: action.conversation};
  default:
    return state;
  }
}
