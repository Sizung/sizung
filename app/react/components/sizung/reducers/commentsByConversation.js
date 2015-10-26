import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_COMMENTS, CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function commentsByConversation(state = initialState, action = null) {
  switch (action.type) {
  case SET_COMMENTS:
    var ids = action.comments.map(function(comment) {
      return comment.id
    });

    return state.set(action.conversation.id, Immutable.List(ids));
  case DELETE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      const convId = action.comment.conversation_id;
      return state.set(convId, state.get(convId).filter(function(id) {return id != action.comment.id}));
    } else {
      return state;
    }
  case CREATE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      return state.set(action.comment.conversation_id, state.get(action.comment.conversation_id).push(action.comment.id));
    } else {
      return state;
    }
  default:
    return state;
  }
}