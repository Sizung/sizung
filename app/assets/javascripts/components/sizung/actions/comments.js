export const SET_COMMENTS = 'SET_COMMENTS';
export const ADD_COMMENT  = 'ADD_COMMENT';

export function setComments(comments) {
  return {
    type: SET_COMMENTS,
    comments: comments
  };
}

export function addComment(comment) {
  return {
    type: ADD_COMMENT,
    comment: comment
  };
}
