// These are the actions relevant to comments
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';

export const CREATE_COMMENT = 'CREATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';

export function transformCommentFromJsonApi(comment) {
  return {
    id: comment.id,
    type: comment.type,
    body: comment.attributes.body,
    createdAt: comment.attributes.created_at,
    updatedAt: comment.attributes.updated_at,
    authorId: comment.relationships.author.data.id,
    conversationId: comment.relationships.conversation.data.id
  };
}

export function createCommentRemoteOrigin(comment) {
  return {
    type: CREATE_COMMENT,
    status: STATUS_REMOTE_ORIGIN,
    comment: comment
  };
}

export function deleteCommentRemoteOrigin(comment) {
  return {
    type: DELETE_COMMENT,
    status: STATUS_REMOTE_ORIGIN,
    comment: comment
  };
}

export function createCommentSuccess(comment) {
  return {
    type: CREATE_COMMENT,
    status: STATUS_SUCCESS,
    comment: comment
  };
}

// don't export to show that this is not used as UI action handler
// or maybe inline in the 'then' ajax response
export function deleteCommentSuccess(comment) {
  return {
    type: DELETE_COMMENT,
    status: STATUS_SUCCESS,
    comment: comment
  };
}

export function createComment(comment) {
  return function(dispatch) {
    return fetch('/comments', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      },
      body: JSON.stringify({
        comment: comment
      })
    })
    .then(response => response.json())
    .then(function(json) {
      dispatch(createCommentSuccess(transformCommentFromJsonApi(json.data)));
    });
  };
}

export function deleteComment(comment_id) {
  return function(dispatch) {
    return fetch('/comments/' + comment_id, {
      method: 'delete',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      }}
    )
    .then(response => response.json())
    .then(function(json) {
      dispatch(deleteCommentSuccess(transformCommentFromJsonApi(json.data)));
      //if(response.status == 200) {
      //  dispatch(deleteCommentSuccess(response.json()));
      //}
    });
  };
}

