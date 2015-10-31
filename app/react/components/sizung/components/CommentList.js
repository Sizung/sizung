import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { Glyphicon } from 'react-bootstrap';

class CommentList extends Component {
  render() {
    const { currentConversation, comments, createComment, deleteComment } = this.props;
    console.log("Current Conversation: " + this.props.currentConversation);
    return (

    <div className='commentList'>
        <div className='commentListHeader padding-sm box-shadow '>
          <i className='fa fa-comments-o'></i>{' '}<strong>Conversations</strong>
        </div>
        <div className='commentListArea white-bg padding-sm margin-xs-vertical'>
          <div className="commentListConversationHeader">
            # Conv - {this.props.currentConversation.get('id')}
          </div>
        {
         comments.map(function(comment) {
            // use comment object instead
            return(<Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.created_at} deleteComment={deleteComment} />);
          })
        }
        <CommentForm createComment={createComment} currentConversation={currentConversation} />
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
