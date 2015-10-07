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
