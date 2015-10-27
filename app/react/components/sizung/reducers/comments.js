// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_COMMENTS, CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function comments(state = initialState, action = null) {
  switch (action.type) {
  case CREATE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      return state.set(action.comment.id, action.comment);
    }
    else if(action.status == STATUS_REMOTE_ORIGIN) {
      return state.set(action.comment.id, action.comment);
    }
    else {
      return state;
    }
  case DELETE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      return state.remove(action.comment.id);
    }
    else if(action.status == STATUS_REMOTE_ORIGIN) {
      return state.remove(action.comment.id);
    }
    else {
      return state;
    }
  case SET_COMMENTS:
    for(var i=0; i<action.comments.length; i++) {
      state = state.set(action.comments[i].id, action.comments[i]);
    }
    return state;
  default:
    return state;
  }
}
