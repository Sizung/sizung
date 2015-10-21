import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_COMMENTS, CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';

export default function commentsByConversation(state = {}, action = null) {
  switch (action.type) {
  case SET_COMMENTS:
    var ids = action.comments.map(function(comment) {
      return comment.id
    });

    var newState = {};
    newState[action.conversation.id] = ids;
    return newState;
  case DELETE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      const convId = action.comment.conversation_id
      var newState = {};
      newState[convId] = state[convId].filter(function(id) {return id != action.comment.id});
      return newState;
    }
  default:
    return state;
  }
}
