/*
 This Reducer file handles the UI state of components for the conversation view
 For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */


import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.Map({ mode: 'default', title: '' });

export default function composerUi(state = initialState, action = null) {
  switch (action.type) {
    case constants.SET_COMPOSER_STATE:
      return new Immutable.Map({ mode: action.state.mode, title: action.state.title });

    case constants.RESET_COMPOSER_STATE:
      return initialState;

    default: return state;
  }
}
