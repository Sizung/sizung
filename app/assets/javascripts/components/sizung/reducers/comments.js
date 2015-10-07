import { SET_COMMENTS } from '../actions/comments';

export default function comments(state = {}, action = null) {
  switch (action.type) {
  case SET_COMMENTS:
    return action.comments;
  default:
    return state;
  }
}
