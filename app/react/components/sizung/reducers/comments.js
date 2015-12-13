// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { SET_CONVERSATION_OBJECTS } from '../actions/conversationObjects'
import { CREATE_AGENDA_ITEM, FETCH_CONVERSATION_OBJECTS } from '../actions/agendaItems';
import { setObject, deleteObject, setObjects, setObjectsFromConversationObjectsList } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function comments(state = initialState, action = null) {
  switch (action.type) {
    case CREATE_COMMENT: return setObject(state, action, 'comment');
    case DELETE_COMMENT: return deleteObject(state, action, 'comment');
    case SET_CONVERSATION_OBJECTS: return setObjectsFromConversationObjectsList(state, action, 'comments');
    case FETCH_CONVERSATION_OBJECTS: return setObjectsFromConversationObjectsList(state, action, 'comments');
    default: return state;
  }
}
