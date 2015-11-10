import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import AgendaItemInTimeline from './AgendaItemInTimeline'
import { Glyphicon } from 'react-bootstrap';

class ConversationObjectList extends Component {
  render() {
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem, currentUser } = this.props;
    return (

    <div className='commentList col-xs-12 zero-padding'>
      <div className='commentListHeader padding-sm col-xs-12 zero-padding  box-shadow'>
        <i className='fa fa-comments-o'></i>{' '}<strong>Conversations</strong>
      </div>
      <div className='commentListArea white-bg margin-xs-vertical col-xs-12 zero-padding  box-shadow'>
        <div className="commentListConversationHeader col-xs-12 padding-sm-vertical">
          # Conv - {currentConversation.title}
        </div>
        <div className='comments'>
        {
          conversationObjects.map(function(conversationObject) {
            if (conversationObject.type === 'comments') {
              const comment = conversationObject;
              // use comment object instead
              return(<Comment key={comment.id} id={comment.id} body={comment.body} author={comment.author} createdAt={comment.createdAt} deleteComment={deleteComment} />);
            }
            else if (conversationObject.type === 'agendaItems') {
              const agendaItem = conversationObject;
              return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem}/>
            }
            else {
              console.log('Component not found for conversationObject: ', conversationObject);
            }
          })
        }
        </div>
        <CommentForm createComment={createComment} createAgendaItem={createAgendaItem} currentUser={currentUser} parent={currentConversation} />
      </div>

    </div>
    );
  }
}

ConversationObjectList.propTypes = {
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  conversationObjects: PropTypes.array.isRequired,
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
};

export default ConversationObjectList;
