import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import AgendaItemInTimeline from './AgendaItemInTimeline'
import { Glyphicon } from 'react-bootstrap';

class ConversationObjectList extends Component {
  constructor() {
    super();

    this.handleShowMore = (e) => {
      e.preventDefault();
      this.props.fetchConversationObjects('conversations', this.props.currentConversation.id, this.props.nextPageUrl);
    }
  }

  render() {
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem, currentUser } = this.props;

    console.log('nextPageUrl: ', this.props.nextPageUrl);
    var showMore;
    if(this.props.nextPageUrl) {
      showMore = <div onClick={this.handleShowMore}>Show More</div>;
    }

    var conversationObjectElements;
    if(conversationObjects) {
      conversationObjectElements = conversationObjects.map(function(conversationObject) {
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
      });
    }

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
          { showMore }
          { conversationObjectElements }
        </div>
        <CommentForm createComment={createComment} createAgendaItem={createAgendaItem} currentUser={currentUser} parent={currentConversation} />
      </div>

    </div>
    );
  }
}

ConversationObjectList.propTypes = {
  nextPageUrl: PropTypes.string,
  fetchConversationObjects: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  conversationObjects: PropTypes.array,
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null
};

export default ConversationObjectList;
