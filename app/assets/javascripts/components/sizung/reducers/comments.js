// These are the reducer functions for the comment actions
// They are responsible for returning a new state or state-sub-tree according the previous state and the action that
// is coming in. Reducer functions have to be pure functions without any side-effects.
// The are not allowed to change the state object. They have to return a new state object that they
// create using the previous state and whatever they have to do because of the action they have to handle.

import { SET_COMMENTS, ADD_COMMENT } from '../actions/comments';

export default function comments(state = [], action = null) {
  switch (action.type) {
  case ADD_COMMENT:
    return state.concat([action.comment]);
  case SET_COMMENTS:
    return action.comments;
  default:
    return state;
  }
}
