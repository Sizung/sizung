import { SET_CURRENT_CONVERSATION } from '../actions/conversations';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function currentConversation(state = initialState, action = null) {
  switch (action.type) {
  case SET_CURRENT_CONVERSATION:
    return Immutable.fromJS(action.conversation);
  default:
    return state;
  }
}
