import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment';
import AgendaItemInTimeline from './../AgendaItemInTimeline'
import DeliverableInTimeline from './../DeliverableInTimeline'
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import UserListApp from "../../containers/UserListApp";


@CSSModules(styles)
class ConversationObjectList extends Component {
  constructor() {
    super();

    this.handleShowMore = (e) => {
      e.preventDefault();
      var parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

      this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
    }
  }

  prepareChildElements(conversationObjects, deleteComment, updateAgendaItem) {
    if(conversationObjects) {
      return conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          return(<Comment key={comment.id} comment={comment} deleteComment={deleteComment} />);
        }
        else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem} updateAgendaItem={updateAgendaItem}/>
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
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem, updateAgendaItem,
      createDeliverable, commentForm, isFetching, nextPageUrl } = this.props;

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, deleteComment, updateAgendaItem);

    return (

    <div styleName='list-container'>
      <div styleName='list-header'>
        <i styleName='comments-icon'></i>{' '}Conv - {currentConversation.title}
        <div styleName='member-dropdown'>
          <DropdownButton bsStyle='default' bsSize="small" title='Members' pullRight>
            <MenuItem eventKey="1">
              <div>
                <UserListApp/>
              </div>
            </MenuItem>
          </DropdownButton>
        </div>
      </div>
      <div styleName='list'>
          { showMore }
          { conversationObjectElements }
      </div>
      <div styleName='list-footer'>
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
