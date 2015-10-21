import { SET_CURRENT_CONVERSATION } from '../actions/conversations';

export default function currentConversation(state = {}, action = null) {
  switch (action.type) {
  case SET_CURRENT_CONVERSATION:
    return action.conversation;
  default:
    return state;
  }
}
