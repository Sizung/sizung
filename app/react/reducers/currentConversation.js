import { CONVERSATION } from '../actions/conversations';
import Immutable from 'immutable';

const initialState = new Immutable.Map();

export default function currentConversation(state = initialState, action = null) {
  switch (action.type) {
    case CONVERSATION: return Immutable.fromJS(action.conversation);
    default: return state;
  }
}
