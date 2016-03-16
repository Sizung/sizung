/*
 This Reducer file handles the UI state of components for the conversation view
 For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */


import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.Map({ showConversationMembers: false });

export default function showConversationMembers(state = initialState, action = null) {
  switch (action.type) {
    case constants.SHOW_CONVERSATION_MEMBERS:
      return new Immutable.Map({ showConversationMembers: action.visibility });

    case constants.RESET_CONVERSATION_UI:
      return initialState;

    default: return state;
  }
}
