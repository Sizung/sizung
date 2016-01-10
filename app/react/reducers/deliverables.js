// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses';
import { SET_DELIVERABLES, CREATE_DELIVERABLE, UPDATE_DELIVERABLE } from '../actions/deliverables';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/agendaItems';
import { setObject, deleteObject, setObjects, setObjectsFromConversationObjectsList, setObjectsFrom } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function deliverables(state = initialState, action = null) {
  if (action.included) {
    return setObjectsFrom(state, action, action.included, 'deliverables');
  }
  switch (action.type) {
    case CREATE_DELIVERABLE: return setObject(state, action, 'deliverable');
    case UPDATE_DELIVERABLE: return setObject(state, action, 'deliverable');
    case SET_DELIVERABLES: return setObjects(state, action, 'deliverables');
    case FETCH_CONVERSATION_OBJECTS: return setObjectsFromConversationObjectsList(state, action, 'deliverables');
    default: return state;
  }
}
