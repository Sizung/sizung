import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
import AgendaItemInTimeline from './../AgendaItemInTimeline'
import DeliverableInTimeline from './../DeliverableInTimeline'
import { Glyphicon, DropdownButton, MenuItem, Dropdown, Toggle, Button } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import UserListApp from "../../containers/UserListApp";
import ConversationMemberListApp from "../../containers/ConversationMemberListApp";


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
    this.toggleConversationMembersView = this.toggleConversationMembersView.bind(this);
    this.renderConversationTimeLine = this.renderConversationTimeLine.bind(this);
    this.renderListContainerContent = this.renderListContainerContent.bind(this);
    this.renderListContainerContent = this.renderListContainerContent.bind(this);

    this.state = {
      isConversationMembersViewVisible: false
    }
  }

  prepareChildElements(conversationObjects, deleteComment, updateAgendaItem, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, selectAgendaItem, selectDeliverable, parent) {
    if(conversationObjects) {
      return conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          comment.canCreateAgendaItem = canCreateAgendaItem;
          comment.canCreateDeliverable = canCreateDeliverable;
          comment.parent = parent;
          return(<Comment key={comment.id} comment={comment} deleteComment={deleteComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable} isTimelineHeader={false}/>);
        }
        else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem} selectAgendaItem={selectAgendaItem} updateAgendaItem={updateAgendaItem} isTimelineHeader={false}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} deliverable={deliverable} selectDeliverable={selectDeliverable} updateDeliverable={updateDeliverable} isTimelineHeader={false}/>
        }
        else {
          console.log('Component not found for conversationObject: ', conversationObject);
        }
      });
    }
  }

  prepareShowMore(isFetching, nextPageUrl) {
    if(isFetching) {
      return <div className='col-xs-12' styleName='loading-message'>Loading...</div>;
    }
    else if(nextPageUrl) {
      return <div styleName='load-more-message'><a styleName='link' href="#" onClick={this.handleShowMore}>Show More</a></div>;
    }
  }

  scrollList() {
    window.requestAnimationFrame(() => {
      var node = this.refs.conversationObjectList ? this.refs.conversationObjectList.getDOMNode() : null;
      if (node) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  handleBackClick(e){
    e.preventDefault();
    if ( null != this.props.commentForm.parent && this.props.commentForm.parent.type == "deliverables" ){
      this.props.selectAgendaItem(this.props.currentConversation.id, this.props.commentForm.parent.agendaItem.id);
    } else {
      this.props.backToConversation(this.props.currentConversation.id);
    }
  };

  adjustConversationListHeight() {
    var headerInTimelineHeight = ( null == this.refs.headerInTimeline ) ? 0 : $(this.refs.headerInTimeline.getDOMNode()).outerHeight();
    var conversationHeaderHeight = $(this.refs.conversationHeader.getDOMNode()).outerHeight();
    var listNode = this.refs.conversationObjectList.getDOMNode();
    var headerInTimelineBottomMargin = ( headerInTimelineHeight === 0 ? 0 : 2 );
    $(listNode).css('top',(headerInTimelineHeight + conversationHeaderHeight + headerInTimelineBottomMargin ));
  }

  componentDidUpdate() {
    if ( this.shouldScrollBottom ) {
      this.scrollList();
    }
    this.adjustConversationListHeight();
  }

  componentWillUpdate() {
    var node = this.refs.conversationObjectList.getDOMNode();
    console.log("node: " + node);
    if (!node)
      this.shouldScrollBottom = (Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) <= 20); // 20px is the offset tolerance considering borders and padding
  }

  componentDidMount() {
    window.addEventListener("resize", this.adjustConversationListHeight);
  }

  toggleConversationMembersView() {
    this.setState({ isConversationMembersViewVisible: !this.state.isConversationMembersViewVisible});
  }

  renderListContainerContent() {
    return (this.state.isConversationMembersViewVisible ? this.renderConversationMembersView() : this.renderConversationTimeLine());
  }

  renderConversationMembersView() {
    console.log("Rendering renderConversationMembersView");
    return (<div ref='conversationObjectList' styleName='member-list'>
        <ConversationMemberListApp toggleConversationMembersView={this.toggleConversationMembersView}/>
      </div>
    );
  }

  renderConversationTimeLine() {
    console.log("Rendering renderConversationTimeLine");
    const { currentConversation, conversationObjects, createComment, deleteComment, createAgendaItem, updateAgendaItem,
        createDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
        canCreateDeliverable, selectAgendaItem, selectDeliverable, users } = this.props;

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, deleteComment, updateAgendaItem, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, selectAgendaItem, selectDeliverable, commentForm.parent);

    var conversationTimelineHeader = "";
    var isTimelineHeader = false;
    if ( null != this.props.commentForm.parent) {
      switch (this.props.commentForm.parent.type) {
        case "agendaItems" :
          isTimelineHeader = true;
          conversationTimelineHeader = (<div styleName='agenda-item-header-in-timeline' ref='headerInTimeline'>
            <div styleName='back-to-conversation-link-container'>
              <Button bsStyle='link' onClick={this.handleBackClick} styleName='back-to-conversation-link'>
                <i styleName='back-to-conversation-icon'></i>
              </Button>
            </div>
            <AgendaItemInTimeline agendaItem={this.props.commentForm.parent}
                                  updateAgendaItem={this.props.updateAgendaItem}
                                  isTimelineHeader={isTimelineHeader}/>
          </div>);
          break;

        case "deliverables" :
          isTimelineHeader = true;
          conversationTimelineHeader = (<div styleName='deliverable-header-in-timeline' ref='headerInTimeline'>
            <div styleName='back-to-conversation-link-container'>
              <Button bsStyle='link' onClick={this.handleBackClick} styleName='back-to-conversation-link'>
                <i styleName='back-to-conversation-icon'></i>
              </Button>
            </div>
            <DeliverableInTimeline deliverable={this.props.commentForm.parent}
                                   updateDeliverable={this.props.updateDeliverable}
                                   isTimelineHeader={isTimelineHeader}/>
          </div>);
          break;

        default:
          conversationTimelineHeader = "";
          break;
      }
    }

    console.log("conversationObjectElements: " + conversationObjectElements);
    return(<div style={{ width: '100%', height: '100%'}}>
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


  render() {

    console.log("Rendering List: " + this.state.isConversationMembersViewVisible);
    const { currentConversation, users } = this.props;
    return(
    <div styleName='list-container'>
      <div styleName='list-header' ref='conversationHeader'>
        <div styleName="conversation-title-container">
          <h4 styleName='conversation-title'>
            <i styleName='comments-icon'></i>{" " + currentConversation.title}
          </h4>
          <a styleName='conversation-close-button' href={"/organizations/" + this.props.currentConversation.organization_id + "/conversations"}>
            <i styleName='conversation-close-icon' ></i>
          </a>
        </div>

        <div styleName='member-dropdown-container'>
          <div className="btn-group">
            <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div className="pull-right" styleName='member-badge'><div onClick={this.toggleConversationMembersView} styleName='member-badge-contents'>{users.size}</div></div>
              <i className="pull-right" styleName='user-icon'></i>
            </a>
          </div>
        </div>
      </div>
      {this.renderListContainerContent()}
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
  users: PropTypes.object.isRequired,
  conversationMembers: PropTypes.object.isRequired,
  updateAgendaItem: PropTypes.func.isRequired
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false
};

export default ConversationObjectList;
