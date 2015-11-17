// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM } from '../actions/agendaItems';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/conversationObjects';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function agendaItems(state = initialState, action = null) {
  switch (action.type) {
  case FETCH_CONVERSATION_OBJECTS:
    if (action.status == STATUS_SUCCESS) {
      for (var i = 0; i < action.conversationObjects.length; i++) {
        const conversationObject = action.conversationObjects[i];
        if (conversationObject.type === 'agendaItems') {
          state = state.set(conversationObject.id, conversationObject);
        }
      }
      return state;
    }
    else {
      return state;
    }
  case CREATE_AGENDA_ITEM:
    if(action.status == STATUS_SUCCESS) {
      return state.set(action.agendaItem.id, action.agendaItem);
    }
    else if(action.status == STATUS_REMOTE_ORIGIN) {
      return state.set(action.agendaItem.id, action.agendaItem);
    }
    else {
      return state;
    }
  case SET_AGENDA_ITEMS:
    for(var i=0; i<action.agendaItems.length; i++) {
      state = state.set(action.agendaItems[i].id, action.agendaItems[i]);
    }
    return state;
  default:
    return state;
  }
}
