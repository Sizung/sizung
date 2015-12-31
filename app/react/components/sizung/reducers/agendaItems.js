// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM, UPDATE_AGENDA_ITEM } from '../actions/agendaItems';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/conversationObjects';
import { setObject, setObjects, setObjectsFromConversationObjectsList } from '../utils/reducerUtils';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function agendaItems(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_CONVERSATION_OBJECTS: return setObjectsFromConversationObjectsList(state, action, 'agendaItems');
    case CREATE_AGENDA_ITEM: return setObject(state, action, 'agendaItem');
    case UPDATE_AGENDA_ITEM: return setObject(state, action, 'agendaItem');
    case SET_AGENDA_ITEMS: return setObjects(state, action, 'agendaItems');
    default: return state;
  }
}
