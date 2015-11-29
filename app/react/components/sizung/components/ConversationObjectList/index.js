import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
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
    this.scrollElement = this.scrollElement.bind(this);
  }

  prepareChildElements(conversationObjects, deleteComment, updateAgendaItem, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, parent) {
    if(conversationObjects) {
      return conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          comment.canCreateAgendaItem = canCreateAgendaItem;
          comment.canCreateDeliverable = canCreateDeliverable;
          comment.parent = parent;
          return(<Comment key={comment.id} comment={comment} deleteComment={deleteComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable}/>);
        }
        else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem} updateAgendaItem={updateAgendaItem}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} deliverable={deliverable} updateDeliverable={updateDeliverable}/>
        }
        else {
          console.log('Component not found for conversationObject: ', conversationObject);
        }
      });
    }
  }

  prepareShowMore(isFetching, nextPageUrl) {
    if(isFetching) {
      return <div styleName='loading-message'>Loading...</div>;
    }
    else if(nextPageUrl) {
      return <div styleName='load-more-message'><a styleName='link' href="#" onClick={this.handleShowMore}>Show More</a></div>;
    }
  }

  scrollElement() {
    var _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.conversationObjectList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  componentDidUpdate() {
    if ( this.shouldScrollBottom ) {
      this.scrollElement();
    }
  }

  componentWillUpdate() {
    var node = this.refs.conversationObjectList.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  render() {
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem, updateAgendaItem,
      createDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem, canCreateDeliverable } = this.props;

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, deleteComment, updateAgendaItem, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, commentForm.parent);
    return (

    <div styleName='list-container'>
      <div styleName='list-header'>
        <i styleName='comments-icon'></i>{' '}Conv - {currentConversation.title}
        <div styleName='member-dropdown-container'>
          <DropdownButton styleName='member-dropdown' bsStyle='default' bsSize="small" title='Members' pullRight noCaret>
            <li>
              <div styleName='member-list-container'>
                <UserListApp/>
              </div>
            </li>
            <li className='divider'></li>
            <li>
              <a href="/users/invitation/new">Invite member</a>
            </li>
          </DropdownButton>
        </div>
      </div>
      <div ref='conversationObjectList' styleName='list'>
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
  createDeliverable: PropTypes.func.isRequired,
  updateDeliverable: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  conversationObjects: PropTypes.array,
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  canCreateAgendaItem: PropTypes.bool.isRequired,
  canCreateDeliverable: PropTypes.bool.isRequired
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false
};

export default ConversationObjectList;
