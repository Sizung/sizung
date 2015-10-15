import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';

class CommentList extends Component {
  render() {
    const { conversations, comments, addComment } = this.props;
    const currentConversation = conversations.currentConversation;

    return (
      <div className='commentList'>
        <CommentForm addComment={addComment} currentConversation={currentConversation} />
        {
          comments.map(function(comment) {
            return(<Comment key={comment.id} body={comment.body} author={comment.author} />);
          })
        }
      </div>
    );
  }
}

CommentList.propTypes = {
  addComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  conversations: PropTypes.object.isRequired
};

export default CommentList;
