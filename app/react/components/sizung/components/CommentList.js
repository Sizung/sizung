import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { Glyphicon } from 'react-bootstrap';

class CommentList extends Component {
  render() {
    const { currentConversation, comments, createComment, deleteComment, createAgendaItem } = this.props;
    return (

    <div className='commentList col-xs-12 zero-padding'>
      <div className='commentListHeader padding-sm col-xs-12 zero-padding  box-shadow'>
        <i className='fa fa-comments-o'></i>{' '}<strong>Conversations</strong>
      </div>
      <div className='commentListArea white-bg margin-xs-vertical col-xs-12 zero-padding  box-shadow'>
        <div className="commentListConversationHeader col-xs-12 padding-sm-vertical">
          # Conv - {this.props.currentConversation.get('id')}
        </div>
        <div className='comments'>
        {
          comments.map(function(comment) {
            // use comment object instead
            return(<Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.createdAt} deleteComment={deleteComment} />);
          })
        }
        </div>
        <CommentForm createComment={createComment} createAgendaItem={createAgendaItem} currentConversation={currentConversation} />
      </div>

    </div>
    );
  }
}

CommentList.propTypes = {
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  currentConversation: PropTypes.object.isRequired
};

export default CommentList;
