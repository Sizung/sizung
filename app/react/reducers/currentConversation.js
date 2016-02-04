import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.Map();

export default function currentConversation(state = initialState, action = null) {
  switch (action.type) {
    case constants.CONVERSATION: return Immutable.fromJS(action.conversation);
    default: return state;
  }
}
