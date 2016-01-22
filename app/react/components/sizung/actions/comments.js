// These are the actions relevant to comments
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from './statuses.js';
import { transformCommentFromJsonApi } from '../utils/jsonApiUtils.js';

export const CREATE_COMMENT = 'CREATE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';

export function createCommentRemoteOrigin(comment) {
  return {
    type: CREATE_COMMENT,
    status: STATUS_REMOTE_ORIGIN,
    comment,
  };
}

export function updateCommentRemoteOrigin(comment) {
  return {
    type: UPDATE_COMMENT,
    status: STATUS_REMOTE_ORIGIN,
    comment,
  };
}

export function deleteCommentRemoteOrigin(comment) {
  return {
    type: DELETE_COMMENT,
    status: STATUS_REMOTE_ORIGIN,
    comment,
  };
}

export function createCommentSuccess(comment) {
  return {
    type: CREATE_COMMENT,
    status: STATUS_SUCCESS,
    comment,
  };
}

export function updateCommentSuccess(comment) {
  return {
    type: UPDATE_COMMENT,
    status: STATUS_SUCCESS,
    comment,
  };
}

// don't export to show that this is not used as UI action handler
// or maybe inline in the 'then' ajax response
export function deleteCommentSuccess(comment) {
  return {
    type: DELETE_COMMENT,
    status: STATUS_SUCCESS,
    comment,
  };
}

export function createComment(comment) {
  if (comment.commentable_type === 'conversations') {
    comment.commentable_type = 'Conversation';
  } else if (comment.commentable_type === 'agendaItems') {
    comment.commentable_type = 'AgendaItem';
  } else if (comment.commentable_type === 'deliverables') {
    comment.commentable_type = 'Deliverable';
  }

  return (dispatch) => {
    return fetch('/comments', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
      },
      body: JSON.stringify({
        comment,
      }),
    })
    .then(response => response.json())
    .then((json) => {
      dispatch(createCommentSuccess(transformCommentFromJsonApi(json.data)));
    });
  };
}

export function updateComment(comment) {
  if (comment.commentable_type === 'conversations') {
    comment.commentable_type = 'Conversation';
  } else if (comment.commentable_type === 'agendaItems') {
    comment.commentable_type = 'AgendaItem';
  } else if (comment.commentable_type === 'deliverables') {
    comment.commentable_type = 'Deliverable';
  }

  return (dispatch) => {
    return fetch('/comments/' + comment.id, {
      method: 'put',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
      },
      body: JSON.stringify({
        comment,
      }),
    })
        .then(response => response.json())
        .then((json) => {
          dispatch(updateCommentSuccess(transformCommentFromJsonApi(json.data)));
        });
  };
}

export function deleteComment(commentId) {
  return (dispatch) => {
    return fetch('/comments/' + commentId, {
      method: 'delete',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
      } }
    )
    .then(response => response.json())
    .then((json) => {
      dispatch(deleteCommentSuccess(transformCommentFromJsonApi(json.data)));
      // if(response.status == 200) {
      //   dispatch(deleteCommentSuccess(response.json()));
      // }
    });
  };
}

