import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';

class CommentList extends Component {
  render() {
    const { comments, addComment } = this.props;

    return (
      <div className='commentList'>
        <CommentForm addComment={addComment} />
        {
          comments.map(function(comment) {
            return(<Comment key={comment.id} text={comment.text} />);
          })
        }
      </div>
    );
  }
}

CommentList.propTypes = {
  addComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired
};

export default CommentList;
