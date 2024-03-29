/*
 This Reducer file handles the UI state of components for the conversation view
 For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */


import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.Map({ conversationSettingsState: 'hide' });

export default function conversationUi(state = initialState, action = null) {
  switch (action.type) {
    case constants.SET_CONVERSATION_SETTINGS_STATE:
      return new Immutable.Map({ conversationSettingsState: action.state });

    case constants.RESET_CONVERSATION_UI:
      return initialState;

    default: return state;
  }
}
