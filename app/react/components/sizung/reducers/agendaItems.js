// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM } from '../actions/agendaItems';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function agendaItems(state = initialState, action = null) {
  switch (action.type) {
  case CREATE_AGENDA_ITEM:
    if(action.status == STATUS_SUCCESS) {
      return state.set(action.agendaItem.data.id, action.agendaItem.data);
    }
    else {
      return state;
    }
  case SET_AGENDA_ITEMS:
    for(var i=0; i<action.agendaItems.data.length; i++) {
      state = state.set(action.agendaItems.data[i].id, action.agendaItems.data[i]);
    }
    return state;
  default:
    return state;
  }
}
