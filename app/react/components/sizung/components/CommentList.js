import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { Glyphicon } from 'react-bootstrap';

class CommentList extends Component {
  render() {
    const { currentConversation, comments, createComment, deleteComment } = this.props;

    return (
      <div className='commentList'>
        <div className='commentListHeader padding-sm-vertical'>
          <i className='fa fa-comments-o'></i>{' '}Conversations
        </div>
        <div className='commentListArea white-bg box-shadow padding-sm margin-xs-vertical'>
        <CommentForm createComment={createComment} currentConversation={currentConversation} />
        {
          comments.map(function(comment) {
            // use comment object instead
            return(<Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.created_at} deleteComment={deleteComment} />);
          })
        }
        </div>
      </div>
    );
  }
}

CommentList.propTypes = {
  createComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  currentConversation: PropTypes.object.isRequired
};

export default CommentList;
