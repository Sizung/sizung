import * as api from '../utils/api';
import * as constants from './constants';
import * as transform from '../utils/jsonApiUtils';

const createCommentRemoteOrigin = (comment) => {
  return {
    type: constants.CREATE_COMMENT,
    status: constants.STATUS_REMOTE_ORIGIN,
    comment,
    entity: comment,
  };
};

const updateCommentRemoteOrigin = (comment) => {
  return {
    type: constants.UPDATE_COMMENT,
    status: constants.STATUS_REMOTE_ORIGIN,
    comment,
    entity: comment,
  };
};

const deleteCommentRemoteOrigin = (comment) => {
  return {
    type: constants.DELETE_COMMENT,
    status: constants.STATUS_REMOTE_ORIGIN,
    comment,
    entity: comment,
  };
};

const createComment = (comment) => {
  if (comment.commentable_type === 'conversations') {
    comment.commentable_type = 'Conversation';
  } else if (comment.commentable_type === 'agendaItems') {
    comment.commentable_type = 'AgendaItem';
  } else if (comment.commentable_type === 'deliverables') {
    comment.commentable_type = 'Deliverable';
  }

  return (dispatch) => {
    api.postJson('/api/comments', { comment }, (json) => {
      const commentObject = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.CREATE_COMMENT,
        status: constants.STATUS_SUCCESS,
        comment: commentObject,
        entity: commentObject,
      });
    });
  };
};

const updateComment = (comment) => {
  if (comment.commentable_type === 'conversations') {
    comment.commentable_type = 'Conversation';
  } else if (comment.commentable_type === 'agendaItems') {
    comment.commentable_type = 'AgendaItem';
  } else if (comment.commentable_type === 'deliverables') {
    comment.commentable_type = 'Deliverable';
  }

  return (dispatch) => {
    api.putJson('/api/comments/' + comment.id, { comment }, (json) => {
      const commentObject = transform.transformCommentFromJsonApi(json.data);

      dispatch({
        type: constants.UPDATE_COMMENT,
        status: constants.STATUS_SUCCESS,
        comment: commentObject,
        entity: commentObject,
      });
    });
  };
};

const deleteComment = (commentId) => {
  return (dispatch) => {
    api.deleteJson('/api/comments/' + commentId, (json) => {
      const commentObject = transform.transformCommentFromJsonApi(json.data);

      dispatch({
        type: constants.DELETE_COMMENT,
        status: constants.STATUS_SUCCESS,
        comment: commentObject,
        entity: commentObject,
      });
    });
  };
};

export {
  createComment,
  createCommentRemoteOrigin,
  updateComment,
  updateCommentRemoteOrigin,
  deleteComment,
  deleteCommentRemoteOrigin,
};
