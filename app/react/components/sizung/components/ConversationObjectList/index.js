import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
import AgendaItemInTimeline from './../AgendaItemInTimeline'
import DeliverableInTimeline from './../DeliverableInTimeline'
import { Glyphicon, DropdownButton, MenuItem, Dropdown, Toggle, Button } from 'react-bootstrap';
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
    this.scrollList = this.scrollList.bind(this);
    this.adjustConversationListHeight = this.adjustConversationListHeight.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  prepareChildElements(conversationObjects, deleteComment, updateAgendaItem, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, selectAgendaItem, selectDeliverable, parent) {
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
          return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem} selectAgendaItem={selectAgendaItem} updateAgendaItem={updateAgendaItem}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} deliverable={deliverable} selectDeliverable={selectDeliverable} updateDeliverable={updateDeliverable}/>
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

  scrollList() {
    var _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.conversationObjectList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  handleBackClick(e){
    e.preventDefault();
    this.props.backToConversation(this.props.currentConversation.id);
  };

  adjustConversationListHeight() {
    var headerInTimelineNode = this.refs.headerInTimeline.getDOMNode();
    var listNode = this.refs.conversationObjectList.getDOMNode();
    var conversationHeaderNode = this.refs.conversationHeader.getDOMNode();
    $(listNode).css('top',($(headerInTimelineNode).outerHeight() + $(conversationHeaderNode).outerHeight()));
  }

  componentDidUpdate() {
    if ( this.shouldScrollBottom ) {
      this.scrollList();
    }
    this.adjustConversationListHeight();
  }

  componentWillUpdate() {
    var node = this.refs.conversationObjectList.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  render() {
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem, updateAgendaItem,
      createDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
      canCreateDeliverable, selectAgendaItem, selectDeliverable, users } = this.props;

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, deleteComment, updateAgendaItem, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, selectAgendaItem, selectDeliverable, commentForm.parent);
    var conversationTimelineHeader = "";
    if ( null != this.props.commentForm.parent) {
      switch (this.props.commentForm.parent.type) {
        case "agendaItems" :
          conversationTimelineHeader = (<div styleName='header-in-timeline' ref='headerInTimeline'>
            <div styleName='back-to-conversation-link-container'>
              <Button bsStyle='link' onClick={this.handleBackClick} styleName='back-to-conversation-link'>
                <i styleName='back-to-conversation-icon'></i>
              </Button>
            </div>
            <AgendaItemInTimeline agendaItem={this.props.commentForm.parent}
                                  updateAgendaItem={this.props.updateAgendaItem}/>
          </div>);
          break;

        case "deliverables" :
          conversationTimelineHeader = (<div styleName='header-in-timeline' ref='headerInTimeline'>
            <div styleName='back-to-conversation-link-container'>
              <Button bsStyle='link' onClick={this.handleBackClick} styleName='back-to-conversation-link'>
                <i styleName='back-to-conversation-icon'></i>
              </Button>
            </div>
            <DeliverableInTimeline deliverable={this.props.commentForm.parent}
                                   updateDeliverable={this.props.updateDeliverable}/>
          </div>);
          break;

        default:
          conversationTimelineHeader = "";
          break;
      }
    }

    return (

    <div styleName='list-container'>
      <div id='ani' styleName='list-header' ref='conversationHeader'>
        <Dropdown styleName='conversation-dropdown' ref='conversationDropdown'>
          <Dropdown.Toggle styleName='conversation-dropdown-toggle' bsStyle='default' bsSize="small" pullRight>
            <span styleName='conversation-dropdown-toggle-text'><i styleName='comments-icon'></i>{' '}Conv - {currentConversation.title}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem href={"/organizations/" + this.props.currentConversation.organization_id + "/conversations"}>
              View All Conversations
            </MenuItem>
            <MenuItem href={"/organizations/" + this.props.currentConversation.organization_id + "/conversations/new"}>
              Add New Conversation
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <div styleName='member-dropdown-container'>
          <i styleName='user-icon'></i>{' '}
          <Dropdown styleName='member-dropdown' bsStyle='default' ref='memberDropdown' pullRight noCaret>
            <Dropdown.Toggle styleName='member-dropdown-toggle' bsStyle='default' bsSize="small" pullRight noCaret>
              <div styleName='member-badge'><div styleName='member-badge-contents'>{users.size}</div></div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem href="#">
                <div styleName='member-list-container'>
                  <UserListApp/>
                </div>
              </MenuItem>
              <MenuItem divider/>
              <MenuItem href="/users/invitation/new">
                Invite member
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      { conversationTimelineHeader }
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
  canCreateDeliverable: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  updateAgendaItem: PropTypes.func.isRequired
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false
};

export default ConversationObjectList;
