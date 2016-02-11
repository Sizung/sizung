import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import { Button } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import ConversationMemberListApp from '../../containers/ConversationMemberListApp';
import MeetingParticipantListApp from '../../containers/MeetingParticipantListApp';
import ChatIcon from '../ChatIcon';
import UserIcon from '../UserIcon';
import * as api from '../../utils/api';
import * as Immutable from 'immutable';


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
    this.scrollListToTop = this.scrollListToTop.bind(this);
    this.adjustConversationListHeight = this.adjustConversationListHeight.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.toggleConversationMembersView = this.toggleConversationMembersView.bind(this);
    this.toggleMeetingParticipantsView = this.toggleMeetingParticipantsView.bind(this);
    this.renderConversationTimeLine = this.renderConversationTimeLine.bind(this);
    this.renderConversationMembersView = this.renderConversationMembersView.bind(this);
    this.renderMeetingParticipantsView = this.renderMeetingParticipantsView.bind(this);
    this.renderListContainerContent = this.renderListContainerContent.bind(this);
    this.handleCommentSettingsDropdownScroll = this.handleCommentSettingsDropdownScroll.bind(this);
    this.onCommentFormResize = this.onCommentFormResize.bind(this);
    this.scrollDownToNewActivity = this.scrollDownToNewActivity.bind(this);
    this.showNewActivityMarker = this.showNewActivityMarker.bind(this);
    this.hideNewActivityMarker = this.hideNewActivityMarker.bind(this);
    this.newActivityTimer = 5;

    this.state = {
      isConversationMembersViewVisible: false,
      isMeetingParticipantsViewVisible: false,
    };
  }

  prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, parent, currentUser) {
    if(conversationObjects) {
      var _this = this;
      let ownerId = null;
      let showOwner = false;
      return conversationObjects.map(function(conversationObject) {
        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          comment.canCreateAgendaItem = canCreateAgendaItem;
          comment.canCreateDeliverable = canCreateDeliverable;
          comment.parent = parent;
          if (ownerId !== comment.author.id) {
            ownerId = comment.author.id;
            showOwner = true;
          } else {
            showOwner = false;
          }
          return (<Comment key={comment.id} comment={comment} showAuthor={showOwner} currentUser={currentUser} handleCommentSettingsDropdownScroll={_this.handleCommentSettingsDropdownScroll.bind(_this)} updateComment={updateComment} deleteComment={deleteComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable} isTimelineHeader={false}/>);
        } else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          if (ownerId !== agendaItem.owner.id) {
            ownerId = agendaItem.owner.id;
            showOwner = true;
          } else {
            showOwner = false;
          }
          return <AgendaItemInTimeline key={agendaItem.id} showOwner={showOwner} agendaItem={agendaItem} visitAgendaItem={visitAgendaItem} archiveAgendaItem={archiveAgendaItem} updateAgendaItem={updateAgendaItem} isTimelineHeader={false}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          if (ownerId !== deliverable.owner.id) {
            ownerId = deliverable.owner.id;
            showOwner = true;
          } else {
            showOwner = false;
          }
          return <DeliverableInTimeline key={deliverable.id} showOwner={showOwner} deliverable={deliverable} visitDeliverable={visitDeliverable} archiveDeliverable={archiveDeliverable} updateDeliverable={updateDeliverable} isTimelineHeader={false}/>
        } else {
          console.warn('Component not found for conversationObject: ', conversationObject);
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

  scrollListToTop() {
    window.requestAnimationFrame(() => {
      if (this.listNode) {
        this.listNode.scrollTop = 0;
        this.hideNewActivityMarker();
      }
    });
  }

  handleBackClick(e){
    e.preventDefault();
    if (null != this.props.commentForm.parent && this.props.commentForm.parent.type === "deliverables") {
      this.props.visitAgendaItem(this.props.commentForm.parent.agendaItemId);
    } else if (null != this.props.commentForm.parent && this.props.commentForm.parent.type === "agendaItems") {
      this.props.visitConversation(this.props.commentForm.parent.conversationId);
    } else {
      console.warn('Back click was not handled properly.');
    }
  }

  adjustConversationListHeight() {
    const headerInTimelineHeight = (this.refs.headerInTimeline === undefined) ? 0 : $(this.refs.headerInTimeline).outerHeight();
    const conversationHeaderHeight = ( this.refs.conversationHeader === undefined) ? 0 : $(this.refs.conversationHeader).outerHeight();
    const headerInTimelineBottomMargin = 0;
    $(this.listNode).css('top', (headerInTimelineHeight + conversationHeaderHeight + headerInTimelineBottomMargin));
  }


  static shouldMarkAsSeen = (prevProps, props) => {
    const notHandledByMount = ((!!prevProps.conversationObjects === false || !!prevProps.commentForm.parent === false) && (!!props.conversationObjects === true && !!props.commentForm.parent === true));

    const unseenPrev = prevProps.conversationObjects ? prevProps.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    const unseenNow = props.conversationObjects ? props.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    return (notHandledByMount || !unseenPrev && unseenNow || prevProps.commentForm.parent.id !== props.commentForm.parent.id && unseenNow);
  };

  showNewActivityMarker() {
    $(this.markerNode).css('display', 'block');
    let _this = this;
    if (!this.newActivityTimerId) {
      this.newActivityTimerId = setInterval(function () {
        if (_this.newActivityTimer === 0) {
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

  scrollDownToNewActivity() {
    this.hideNewActivityMarker();
    this.scrollListToBottom();
  }

  componentDidMount() {
    const conversationObjectList = ReactDOM.findDOMNode(this.refs.conversationObjectList);
    if (conversationObjectList) {
      this.listNode = conversationObjectList;
      window.addEventListener("resize", this.adjustConversationListHeight);
      if (this.props.commentForm.parent) {
        this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
      }
      this.adjustConversationListHeight();
      this.scrollListToBottom();
    }
  }

  componentWillUpdate() {
    //Intializing DOM nodes references using refs to be used in the component
    if (this.listNode !== null) {
      this.shouldScrollBottom = (Math.abs(this.listNode.scrollTop + this.listNode.offsetHeight - this.listNode.scrollHeight) <= 20); // 20px is the offset tolerance considering borders and padding
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.listNode = ReactDOM.findDOMNode(this.refs.conversationObjectList);
    let _this = this;
    $(this.listNode).scroll(function () {
      if($(_this.listNode).scrollTop() + $(_this.listNode).innerHeight() >= _this.listNode.scrollHeight) {
        _this.hideNewActivityMarker();
      }
    });

    if (!this.state.isConversationMembersViewVisible && !this.state.isMeetingParticipantsViewVisible) {
      this.commentFormNode = ReactDOM.findDOMNode(this.refs.listFooter);
      this.newActivityMarkerNode = ReactDOM.findDOMNode(this.refs.newActivityMarker);
    }

    if (this.shouldScrollBottom) {
      if (!this.state.isConversationMembersViewVisible && !this.state.isMeetingParticipantsViewVisible) {
        this.scrollListToBottom();
      } else {
        this.scrollListToTop();
      }
    } else {
      this.markerNode = ReactDOM.findDOMNode(this.refs.newActivityMarker);
      if (this.props.conversationObjects.length - prevProps.conversationObjects.length === 1) {
        this.newActivityTimer = 5;
        this.showNewActivityMarker();
      }
    }
    this.adjustConversationListHeight();

    if (ConversationObjectList.shouldMarkAsSeen(prevProps, this.props)) {
      this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    }
  }

  toggleConversationMembersView() {
    this.setState({ isConversationMembersViewVisible: !this.state.isConversationMembersViewVisible });
  }

  renderConversationMembersView() {
    return (<div ref='conversationObjectList' styleName='member-list'>
        <ConversationMemberListApp toggleConversationMembersView={ this.toggleConversationMembersView }/>
      </div>
    );
  }

  toggleMeetingParticipantsView() {
    this.setState({ isMeetingParticipantsViewVisible: !this.state.isMeetingParticipantsViewVisible });
  }

  renderMeetingParticipantsView() {
    return (<div ref='conversationObjectList' styleName='member-list'>
          <MeetingParticipantListApp toggleMeetingParticipantsView={ this.toggleMeetingParticipantsView }/>
        </div>
    );
  }

  onCommentFormResize(commentBoxHeight) {
    $(this.commentFormNode).css('height',commentBoxHeight);
    const listNodeBottomOffset = commentBoxHeight + parseInt($(this.commentFormNode).css('bottom').split('px')[0]);
    $(this.listNode).css('bottom', listNodeBottomOffset + 'px');
    $(this.newActivityMarkerNode).css('bottom', (listNodeBottomOffset + 5) + 'px');
  }

  renderListContainerContent() {
    if (this.state.isConversationMembersViewVisible) {
      return this.renderConversationMembersView();
    } else if (this.state.isMeetingParticipantsViewVisible) {
      return this.renderMeetingParticipantsView();
    }
    return this.renderConversationTimeLine();
  }

  renderConversationTimeLine() {
    const { conversationObjects, createComment, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
        canCreateDeliverable, visitAgendaItem, visitDeliverable } = this.props;

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, commentForm.parent, commentForm.currentUser);

    let conversationTimelineHeader = '';
    this.isTimelineHeader = false;
    const _this = this;
    let listStyle = 'list';
    let listFooterStyle = 'list-footer';
    if (this.props.commentForm.parent !== null) {
      switch (this.props.commentForm.parent.type) {
        case 'agendaItems' :
          listStyle = 'agenda-item-comment-list';
          listFooterStyle = 'agenda-item-comment-list-footer';
          this.isTimelineHeader = true;
          conversationTimelineHeader = (<div styleName='agenda-item-header-in-timeline' ref='headerInTimeline'>
            <a className='pull-right' styleName='back-to-conversation-link' onClick={this.handleBackClick.bind(this)}><span aria-hidden="true">&times;</span></a>
            <AgendaItemInTimeline agendaItem={this.props.commentForm.parent}
              archiveAgendaItem={archiveAgendaItem}
              updateAgendaItem={this.props.updateAgendaItem}
              isTimelineHeader={this.isTimelineHeader}
              visitAgendaItem={visitAgendaItem}
            />
          </div>);
          break;

        case 'deliverables' :
          listStyle = 'deliverable-comment-list';
          listFooterStyle = 'deliverable-comment-list-footer';
          this.isTimelineHeader = true;
          conversationTimelineHeader = (<div styleName='deliverable-header-in-timeline' ref='headerInTimeline'>
            <a styleName='back-to-conversation-link' onClick={this.handleBackClick.bind(this)}><span aria-hidden="true">&times;</span></a>
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
              <span onClick={_this.scrollDownToNewActivity} styleName='timeline-new-activity-scroll'>
                <i styleName='timeline-new-activity-scroll-icon'></i>
              </span>
          </div>
      </div>
    );
  }

  render() {
    const { users } = this.props;
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
          { this.state.isMeetingParticipantsViewVisible ? '' : <button onClick={ this.toggleMeetingParticipantsView }className='btn btn-xs btn-success' style={{ margin: '10px' }}><i className='fa fa-users'></i><span className='hidden-xs'> Start Meeting</span></button> }
        </div>

        <div styleName='member-dropdown-container'>
          <div className="btn-group">
            <a onClick={this.toggleConversationMembersView} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div className="pull-right" styleName='member-badge'><div styleName='member-badge-contents'>{users ? users.size : ''}</div></div>
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
  currentConversationId: PropTypes.string.isRequired,
  canCreateAgendaItem: PropTypes.bool.isRequired,
  canCreateDeliverable: PropTypes.bool.isRequired,
  users: PropTypes.object,
  updateAgendaItem: PropTypes.func.isRequired,
  visitConversation: PropTypes.func,
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false,
};

export default ConversationObjectList;
