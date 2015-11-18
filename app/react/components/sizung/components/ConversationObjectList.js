import React, { Component, PropTypes } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import AgendaItemInTimeline from './AgendaItemInTimeline'
import DeliverableInTimeline from './DeliverableInTimeline'
import { Glyphicon } from 'react-bootstrap';

class ConversationObjectList extends Component {
  constructor() {
    super();

    this.handleShowMore = (e) => {
      e.preventDefault();
      var parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

      this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
    }
  }

  prepareChildElements(conversationObjects, deleteComment) {
    if(conversationObjects) {
      return conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          return(<Comment key={comment.id} comment={comment} deleteComment={deleteComment} />);
        }
        else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} deliverable={deliverable}/>
        }
        else {
          console.log('Component not found for conversationObject: ', conversationObject);
        }
      });
    }
  }

  prepareShowMore(isFetching, nextPageUrl) {
    if(isFetching) {
      return <div className="text-center">Loading...</div>;
    }
    else if(nextPageUrl) {
      return <div className="text-center"><a href="#" onClick={this.handleShowMore}>Show More</a></div>;
    }
  }

  render() {
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem,
      createDeliverable, commentForm, isFetching, nextPageUrl } = this.props;

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, deleteComment);

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
        <CommentForm createComment={createComment}
                     createAgendaItem={createAgendaItem}
                     createDeliverable={createDeliverable}
                     {...commentForm}/>
      </div>

    </div>
    );
  }
}

ConversationObjectList.propTypes = {
  commentForm: PropTypes.shape({
    currentUser: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }),
    parent: PropTypes.object.isRequired,
    canCreateAgendaItem: PropTypes.bool.isRequired,
    canCreateDeliverable: PropTypes.bool.isRequired
  }).isRequired,
  nextPageUrl: PropTypes.string,
  isFetching: PropTypes.bool,
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
  nextPageUrl: null,
  isFetching: false
};

export default ConversationObjectList;
