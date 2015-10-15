import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';

class CommentList extends Component {
  render() {
    const { conversations, comments, addComment, deleteComment } = this.props;
    const currentConversation = conversations.currentConversation;

    return (
      <div className='commentList'>
        <CommentForm addComment={addComment} currentConversation={currentConversation} />
        {
          comments.map(function(comment) {
            return(<Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.created_at} deleteComment={deleteComment} />);
          })
        }
      </div>
    );
  }
}

CommentList.propTypes = {
  addComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  conversations: PropTypes.object.isRequired
};

export default CommentList;
