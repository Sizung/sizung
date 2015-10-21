// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_COMMENTS, CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';

export default function comments(state = {}, action = null) {
  switch (action.type) {
  case CREATE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      //return Object.assign({}, state, {1: 1});
      //return state.concat([action.comment]);
      return state;
    }
  case DELETE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      //return state.filter(function(element) {
      //  return element.id != action.comment.id
      //});
      return state;
    }
  case SET_COMMENTS:
    var newState = {};
    for(var i=0; i<action.comments.length; i++) {
      newState[action.comments[i].id] = action.comments[i];
    }
    return newState;
  default:
    return state;
  }
}
