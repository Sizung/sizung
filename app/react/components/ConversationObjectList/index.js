import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import { Button } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import ConversationMemberListApp from '../../containers/ConversationMemberListApp';
import ChatIcon from '../ChatIcon';
import UserIcon from '../UserIcon';


@CSSModules(styles)
class ConversationObjectList extends Component {
  constructor() {
    super();

    this.handleShowMore = (e) => {
      let parentType;
      e.preventDefault();
      parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

      this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
    }
    this.scrollListToBottom = this.scrollListToBottom.bind(this);
    this.adjustConversationListHeight = this.adjustConversationListHeight.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.toggleConversationMembersView = this.toggleConversationMembersView.bind(this);
    this.renderConversationTimeLine = this.renderConversationTimeLine.bind(this);
    this.renderListContainerContent = this.renderListContainerContent.bind(this);
    this.handleCommentSettingsDropdownScroll = this.handleCommentSettingsDropdownScroll.bind(this);
    this.onCommentFormResize = this.onCommentFormResize.bind(this);
    this.scrolDownToNewActivity = this.scrolDownToNewActivity.bind(this);
    this.showNewActivityMarker = this.showNewActivityMarker.bind(this);
    this.hideNewActivityMarker = this.hideNewActivityMarker.bind(this);
    this.newActivityTimer = 5;

    this.state = {
      isConversationMembersViewVisible: false,
    };
  }

  prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, selectAgendaItem, selectDeliverable, parent, currentUser) {
    let _this;
    if (conversationObjects) {
      _this = this;
      return conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          comment.canCreateAgendaItem = canCreateAgendaItem;
          comment.canCreateDeliverable = canCreateDeliverable;
          comment.parent = parent;
          return (<Comment key={comment.id} comment={comment} currentUser={currentUser} handleCommentSettingsDropdownScroll={_this.handleCommentSettingsDropdownScroll.bind(_this)} updateComment={updateComment} deleteComment={deleteComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable} isTimelineHeader={false}/>);
        } else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} agendaItem={agendaItem} selectAgendaItem={selectAgendaItem} archiveAgendaItem={archiveAgendaItem} updateAgendaItem={updateAgendaItem} isTimelineHeader={false}/>
        } else if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} deliverable={deliverable} selectDeliverable={selectDeliverable} archiveDeliverable={archiveDeliverable} updateDeliverable={updateDeliverable} isTimelineHeader={false}/>
        } else {
          console.log('Component not found for conversationObject: ', conversationObject);
        }
      });
    }
  }

  prepareShowMore(isFetching, nextPageUrl) {
    if (isFetching) {
      return <div className='col-xs-12' styleName='loading-message'>Loading...</div>;
    } else if (nextPageUrl) {
      return <div styleName='load-more-message'><a styleName='link' href="#" onClick={this.handleShowMore}>Show More</a></div>;
    }
  }

  handleCommentSettingsDropdownScroll(commentGearIconNode) {
    if (commentGearIconNode && this.commentFormNode) {
      if (($(commentGearIconNode).offset().top + $(commentGearIconNode).outerHeight()) - $(this.commentFormNode).offset().top > 0) {
        this.listNode.scrollTop += $(commentGearIconNode).outerHeight();
      }
    }
  }

  scrollListToBottom() {
    window.requestAnimationFrame(() => {
      if (this.listNode) {
        this.listNode.scrollTop = this.listNode.scrollHeight;
        this.hideNewActivityMarker();
      }
    });
  }

  handleBackClick(e){
    e.preventDefault();
    if (this.props.commentForm.parent !== null && this.props.commentForm.parent.type === "deliverables") {
      this.props.selectAgendaItem(this.props.currentConversation.id, this.props.commentForm.parent.agendaItem.id);
    } else {
      this.props.backToConversation(this.props.currentConversation.id);
    }
  }

  adjustConversationListHeight() {
    const headerInTimelineHeight = (this.refs.headerInTimeline === null) ? 0 : $(this.refs.headerInTimeline.getDOMNode()).outerHeight();
    const conversationHeaderHeight = ( this.refs.conversationHeader === null) ? 0 : $(this.refs.conversationHeader.getDOMNode()).outerHeight();
    const headerInTimelineBottomMargin = (headerInTimelineHeight === 0 ? 0 : 2);
    $(this.listNode).css('top', (headerInTimelineHeight + conversationHeaderHeight + headerInTimelineBottomMargin));
  }

  componentDidMount() {
    this.listNode = this.refs.conversationObjectList.getDOMNode();
    window.addEventListener('resize', this.adjustConversationListHeight);
    this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);

    this.scrollListToBottom();
  }

  componentWillUpdate() {
    // Intializing DOM nodes references using refs to be used in the component

    if (this.listNode !== null) {
      this.shouldScrollBottom = (Math.abs(this.listNode.scrollTop + this.listNode.offsetHeight - this.listNode.scrollHeight) <= 20); // 20px is the offset tolerance considering borders and padding
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.listNode = this.refs.conversationObjectList.getDOMNode();
    let _this = this;
    $(this.listNode).scroll(function() {
      if($(_this.listNode).scrollTop() + $(_this.listNode).innerHeight() >= _this.listNode.scrollHeight) {
        _this.hideNewActivityMarker();
      }
    });

    if (!this.state.isConversationMembersViewVisible) {
      this.commentFormNode = this.refs.listFooter.getDOMNode();
      this.newActivityMarkerNode = this.refs.newActivityMarker.getDOMNode();
    }
    // this.listNode = this.refs.conversationObjectList.getDOMNode();

    if (this.shouldScrollBottom) {
      this.scrollListToBottom();
    } else {
      this.markerNode = React.findDOMNode(this.refs.newActivityMarker);
      if (this.props.conversationObjects.length - prevProps.conversationObjects.length === 1) {
        this.newActivityTimer = 5;
        this.showNewActivityMarker();
      }
    }
    this.adjustConversationListHeight();
    const unseenPrev = prevProps.conversationObjects.some((obj) => { return obj.unseen; });
    const unseenNow = this.props.conversationObjects.some((obj) => { return obj.unseen; });
    if (!unseenPrev && unseenNow || prevProps.commentForm.parent.id !== this.props.commentForm.parent.id && unseenNow) {
      this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    }
  }

  showNewActivityMarker() {
    $(this.markerNode).css('display', 'block');
    let _this = this;
    if (!this.newActivityTimerId) {
      this.newActivityTimerId = setInterval(function () {
        if (_this.newActivityTimer == 0) {
          _this.hideNewActivityMarker();
          clearInterval(_this.newActivityTimerId);
          _this.newActivityTimerId = null;
        } else {
          _this.newActivityTimer--;
        }
      }, 1000);
    }
  }

  hideNewActivityMarker() {
    $(this.markerNode).fadeOut();
  }

  scrolDownToNewActivity() {
    this.hideNewActivityMarker();
    this.scrollListToBottom();
  }

  toggleConversationMembersView() {
    this.setState({ isConversationMembersViewVisible: !this.state.isConversationMembersViewVisible});
  }

  renderConversationMembersView() {
    return (<div ref='conversationObjectList' styleName='member-list'>
        <ConversationMemberListApp toggleConversationMembersView={this.toggleConversationMembersView}/>
      </div>
    );
  }

  onCommentFormResize(commentBoxHeight) {
    $(this.commentFormNode).css('height',commentBoxHeight);
    const listNodeBottomOffset = commentBoxHeight + parseInt($(this.commentFormNode).css('bottom').split('px')[0]);
    $(this.listNode).css('bottom', listNodeBottomOffset +'px');
    $(this.newActivityMarkerNode).css('bottom', (listNodeBottomOffset + 5) + 'px');
  }

  renderListContainerContent() {
    return (this.state.isConversationMembersViewVisible ? this.renderConversationMembersView() : this.renderConversationTimeLine());
  }

  renderConversationTimeLine() {
    const { currentConversation, conversationObjects, createComment, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
        canCreateDeliverable, selectAgendaItem, selectDeliverable, users } = this.props;

    const showMore = this.prepareShowMore(isFetching, nextPageUrl);
    const conversationObjectElements = this.prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, selectAgendaItem, selectDeliverable, commentForm.parent, commentForm.currentUser);

    let conversationTimelineHeader = '';
    this.isTimelineHeader = false;
    const _this = this;
    let listStyle = 'list';
    let listFooterStyle = 'list-footer';
    if (this.props.commentForm.parent != null) {
      switch (this.props.commentForm.parent.type) {
        case 'agendaItems' :
          listStyle = 'agenda-item-comment-list';
          listFooterStyle = 'agenda-item-comment-list-footer';
          this.isTimelineHeader = true;
          conversationTimelineHeader = (<div styleName='agenda-item-header-in-timeline' ref='headerInTimeline'>
            <div styleName='back-to-conversation-link-container'>
              <Button bsStyle='link' onClick={this.handleBackClick} styleName='back-to-conversation-link'>
                <i styleName='back-to-conversation-icon'></i>
              </Button>
            </div>
            <AgendaItemInTimeline agendaItem={this.props.commentForm.parent}
              archiveAgendaItem={archiveAgendaItem}
              updateAgendaItem={this.props.updateAgendaItem}
              isTimelineHeader={this.isTimelineHeader}
            />
          </div>);
          break;

        case 'deliverables' :
          listStyle = 'deliverable-comment-list';
          listFooterStyle = 'deliverable-comment-list-footer';
          this.isTimelineHeader = true;
          conversationTimelineHeader = (<div styleName='deliverable-header-in-timeline' ref='headerInTimeline'>
            <div styleName='back-to-conversation-link-container'>
              <Button bsStyle='link' onClick={this.handleBackClick} styleName='back-to-conversation-link'>
                <i styleName='back-to-conversation-icon'></i>
              </Button>
            </div>
            <DeliverableInTimeline deliverable={this.props.commentForm.parent}
              archiveDeliverable={archiveDeliverable}
              updateDeliverable={this.props.updateDeliverable}
              isTimelineHeader={this.isTimelineHeader}
            />
          </div>);
          break;

        default:
          conversationTimelineHeader = '';
          break;
      }
    }

    return(<div>
        { conversationTimelineHeader }
        <div ref='conversationObjectList' styleName={listStyle}>
          { showMore }
          { conversationObjectElements }

        </div>
        <div ref='listFooter' styleName={listFooterStyle}>
          <CommentForm createComment={createComment}
            createAgendaItem={createAgendaItem}
            createDeliverable={createDeliverable}
            onResize={this.onCommentFormResize}
            {...commentForm}
          />
        </div>
          <div ref='newActivityMarker' styleName='timeline-new-activity-marker'>
              <span onClick={_this.scrolDownToNewActivity} styleName='timeline-new-activity-scroll'>
                <i styleName='timeline-new-activity-scroll-icon'></i>
              </span>
          </div>
      </div>
    );
  }


  render() {
    const { currentConversation, users } = this.props;
    let chatType = this.props.commentForm.parent.type;
    if (chatType !== null) {
      if (chatType === 'agendaItems') {
        chatType = '( Agenda Item )';
      } else if (chatType === 'deliverables') {
        chatType = '( Deliverable )';
      } else if (chatType === 'conversations') {
        chatType = '';
      }
    } else {
      chatType = '';
    }

    return(
    <div styleName='list-container'>
      <div styleName='list-header' ref='conversationHeader'>
        <div styleName="conversation-title-container">
          <h5 styleName='conversation-title'>
            <ChatIcon inverted={true} size={'large'} style={{ marginRight: '5px' }}/>
            {' CHAT ' + chatType}
          </h5>
        </div>

        <div styleName='member-dropdown-container'>
          <div className="btn-group">
            <a onClick={this.toggleConversationMembersView} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div className="pull-right" styleName='member-badge'><div styleName='member-badge-contents'>{users.size}</div></div>
              <UserIcon inverted={true} size={'x-large'}/>
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
      email: PropTypes.string.isRequired,
    }),
    parent: PropTypes.object.isRequired,
    canCreateAgendaItem: PropTypes.bool.isRequired,
    canCreateDeliverable: PropTypes.bool.isRequired,
  }).isRequired,
  nextPageUrl: PropTypes.string,
  isFetching: PropTypes.bool,
  fetchConversationObjects: PropTypes.func.isRequired,
  createDeliverable: PropTypes.func.isRequired,
  updateDeliverable: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  conversationObjects: PropTypes.array,
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  canCreateAgendaItem: PropTypes.bool.isRequired,
  canCreateDeliverable: PropTypes.bool.isRequired,
  users: PropTypes.object.isRequired,
  conversationMembers: PropTypes.object.isRequired,
  updateAgendaItem: PropTypes.func.isRequired,
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false,
};

export default ConversationObjectList;
