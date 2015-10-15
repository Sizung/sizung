// These are the actions relevant to comments
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

//import 'babel/polyfill';
import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';

export const SET_COMMENTS = 'SET_COMMENTS';
export const ADD_COMMENT  = 'ADD_COMMENT';

export function setComments(comments) {
  return {
    type: SET_COMMENTS,
    comments: comments
  };
}

export function addCommentSuccess(comment) {
  return {
    type: ADD_COMMENT,
    comment: comment
  };
}

export function addComment(comment) {
  return function(dispatch) {
    return fetch('/comments', {
      method: 'post',
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
      console.log(json);
      dispatch(addCommentSuccess(json));
    });
  };
}
