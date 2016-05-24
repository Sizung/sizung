/*
 This Reducer file handles the UI state of components for the conversation view
 For example toggle the ConversationMembers View, toggle the Ping Panel etc.
 */


import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.List();

export default function navigationHistory(state = initialState, action = null) {
  if (action.type === constants.ROUTE_LOCATION_UPDATE) {
    let newState = state;
    // For now, it's assumed that history of 100 navigations should be sufficient to track last open parent
    // and default to organization view if not found in history
    if (newState.size === 100) {
      newState = newState.shift();
    }
    return newState.push(action.payload.pathname);
  }
  return state;
}