// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses';
import { SET_DELIVERABLES, CREATE_DELIVERABLE } from '../actions/deliverables';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/agendaItems';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function deliverables(state = initialState, action = null) {
  switch (action.type) {
    case CREATE_DELIVERABLE:
      if(action.status == STATUS_SUCCESS) {
        return state.set(action.deliverable.id, action.deliverable);
      }
      else if(action.status == STATUS_REMOTE_ORIGIN) {
        return state.set(action.deliverable.id, action.deliverable);
      }
      else {
        return state;
      }

    case SET_DELIVERABLES:
      for(var i=0; i<action.deliverables.length; i++) {
        state = state.set(action.deliverables[i].id, action.deliverables[i]);
      }
      return state;
    case FETCH_CONVERSATION_OBJECTS:
      for(var i=0; i<action.conversationObjects.length; i++) {
        const conversationObject = action.conversationObjects[i];
        if (conversationObject.type === 'deliverables') {
          state = state.set(conversationObject.id, conversationObject);
        }
      };
      return state;
    default:
      return state;
  }
}
