import React, { Component, PropTypes } from 'react';
import Comment from './Comment';

class CommentList extends Component {
  render() {
    const { comments } = this.props;

    return (
      <div className='commentList'>
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
  comments: PropTypes.array.isRequired
};

export default CommentList;
