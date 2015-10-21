import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';

class CommentList extends Component {
  render() {
    const { currentConversation, comments, createComment, deleteComment } = this.props;

    return (
      <div className='commentList'>
        <CommentForm createComment={createComment} currentConversation={currentConversation} />
        {
          comments.map(function(comment) {
            // use comment object instead
            return(<Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.created_at} deleteComment={deleteComment} />);
          })
        }
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
