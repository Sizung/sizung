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
import TimelineHeader from '../TimelineHeader/index';
import ConversationHeader from '../ConversationHeader';

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
    this.toggleConversationMembersView = this.toggleConversationMembersView.bind(this);
    this.renderConversationTimeLine = this.renderConversationTimeLine.bind(this);
    this.renderListContainerContent = this.renderListContainerContent.bind(this);
    this.handleCommentSettingsDropdownScroll = this.handleCommentSettingsDropdownScroll.bind(this);
    this.onCommentFormResize = this.onCommentFormResize.bind(this);
    this.scrollDownToNewActivity = this.scrollDownToNewActivity.bind(this);
    this.showNewActivityMarker = this.showNewActivityMarker.bind(this);
    this.hideNewActivityMarker = this.hideNewActivityMarker.bind(this);
    this.newActivityTimer = 5;

    this.state = {
      isConversationMembersViewVisible: false,
      commentFormHeight: 40,
    };
  }

  prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, parent, currentUser) {
    if (conversationObjects) {
      let ownerId = null;
      let showOwner = false;
      return conversationObjects.map((conversationObject) => {
        const uid = conversationObject.type === 'comments' ? conversationObject.author.id : conversationObject.owner.id;
        if (uid !== ownerId) {
          ownerId = uid;
          showOwner = true;
        } else {
          showOwner = false;
        }

        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          comment.canCreateAgendaItem = canCreateAgendaItem;
          comment.canCreateDeliverable = canCreateDeliverable;
          comment.parent = parent;
          return (<Comment key={comment.id} comment={comment} showAuthor={showOwner} currentUser={currentUser} handleCommentSettingsDropdownScroll={this.handleCommentSettingsDropdownScroll} updateComment={updateComment} deleteComment={deleteComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable} isTimelineHeader={false}/>);
        } else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} showOwner={showOwner} agendaItem={agendaItem} visitAgendaItem={visitAgendaItem} archiveAgendaItem={archiveAgendaItem} updateAgendaItem={updateAgendaItem} isTimelineHeader={false}/>
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} showOwner={showOwner} deliverable={deliverable} visitDeliverable={visitDeliverable} archiveDeliverable={archiveDeliverable} updateDeliverable={updateDeliverable} isTimelineHeader={false}/>
        }
        console.warn('Component not found for conversationObject: ', conversationObject);
      });
    }
  }

  prepareShowMore(isFetching, nextPageUrl) {
    if (isFetching) {
      return <div className={styles.loadingMessage}>Loading...</div>;
    } else if (nextPageUrl) {
      return <div className={styles.loadMoreMessage}><a className={styles.link} href="#" onClick={this.handleShowMore}>Show More</a></div>;
    }
  }

  handleCommentSettingsDropdownScroll(commentGearIconNode) {
    //if (commentGearIconNode && this.commentFormNode) {
    //  if (($(commentGearIconNode).offset().top + $(commentGearIconNode).outerHeight()) - $(this.commentFormNode).offset().top > 0) {
    //    this.listNode.scrollTop += $(commentGearIconNode).outerHeight();
    //  }
    //}
  }

  scrollListToBottom() {
    window.requestAnimationFrame(() => {
      const listNode = this.refs.conversationObjectList;
      if (listNode) {
        listNode.scrollTop = listNode.scrollHeight;
        // this.hideNewActivityMarker();
      }
    });
  }

  scrollListToTop() {
    window.requestAnimationFrame(() => {
      const listNode = this.refs.conversationObjectList;
      if (listNode) {
        listNode.scrollTop = 0;
        // this.hideNewActivityMarker();
      }
    });
  }

  adjustConversationListHeight() {
    //const headerInTimelineHeight = (this.refs.headerInTimeline === undefined) ? 0 : $(this.refs.headerInTimeline).outerHeight();
    //const conversationHeaderHeight = ( this.refs.conversationHeader === undefined) ? 0 : $(this.refs.conversationHeader).outerHeight();
    //const headerInTimelineBottomMargin = 0;
    //$(this.listNode).css('top', (headerInTimelineHeight + conversationHeaderHeight + headerInTimelineBottomMargin));
  }

  static shouldMarkAsSeen = (prevProps, props) => {
    const notHandledByMount = ((!!prevProps.conversationObjects === false || !!prevProps.commentForm.parent === false) && (!!props.conversationObjects === true && !!props.commentForm.parent === true));

    const unseenPrev = prevProps.conversationObjects ? prevProps.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    const unseenNow = props.conversationObjects ? props.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    return (notHandledByMount || !unseenPrev && unseenNow || prevProps.commentForm.parent.id !== props.commentForm.parent.id && unseenNow);
  };

  showNewActivityMarker() {
    //$(this.markerNode).css('display', 'block');
    //let _this = this;
    //if (!this.newActivityTimerId) {
    //  this.newActivityTimerId = setInterval(function () {
    //    if (_this.newActivityTimer === 0) {
    //      _this.hideNewActivityMarker();
    //      clearInterval(_this.newActivityTimerId);
    //      _this.newActivityTimerId = null;
    //    } else {
    //      _this.newActivityTimer--;
    //    }
    //  }, 1000);
    //}
  }

  hideNewActivityMarker() {
    //$(this.markerNode).fadeOut();
  }

  scrollDownToNewActivity() {
    //this.hideNewActivityMarker();
    //this.scrollListToBottom();
  }

  componentDidMount() {
    //const conversationObjectList = ReactDOM.findDOMNode(this.refs.conversationObjectList);
    //if (conversationObjectList) {
    //  this.listNode = conversationObjectList;
    //  window.addEventListener("resize", this.adjustConversationListHeight);
    //  if (this.props.commentForm.parent) {
    //    this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    //  }
    //  this.adjustConversationListHeight();
    //  this.scrollListToBottom();
    //}

    this.onCommentFormResize(this.state.commentFormHeight);
    window.addEventListener("resize", () => { this.onCommentFormResize(this.state.commentFormHeight); });
  }

  componentWillUpdate() {
    //Intializing DOM nodes references using refs to be used in the component
    //if (this.listNode !== null) {
    //  this.shouldScrollBottom = (Math.abs(this.listNode.scrollTop + this.listNode.offsetHeight - this.listNode.scrollHeight) <= 20); // 20px is the offset tolerance considering borders and padding
    //}
  }

  componentDidUpdate(prevProps, prevState) {
    //this.listNode = ReactDOM.findDOMNode(this.refs.conversationObjectList);
    //let _this = this;
    //$(this.listNode).scroll(function () {
    //  if($(_this.listNode).scrollTop() + $(_this.listNode).innerHeight() >= _this.listNode.scrollHeight) {
    //    _this.hideNewActivityMarker();
    //  }
    //});

    if (!this.state.isConversationMembersViewVisible) {
      this.commentFormNode = ReactDOM.findDOMNode(this.refs.listFooter);
      this.newActivityMarkerNode = ReactDOM.findDOMNode(this.refs.newActivityMarker);
    }

    const listNode = this.refs.conversationObjectList;
    // Intializing DOM nodes references using refs to be used in the component
    if (listNode !== null) {

      const shouldScrollBottom = (Math.abs(listNode.scrollTop + listNode.offsetHeight - listNode.scrollHeight) <= 82); // 82px is the offset tolerance considering borders and padding
      //console.log('shouldScrollBottom', listNode.scrollTop, listNode.offsetHeight, listNode.scrollHeight, Math.abs(listNode.scrollTop + listNode.offsetHeight - listNode.scrollHeight), shouldScrollBottom);
      if (shouldScrollBottom) {
        if (!this.state.isConversationMembersViewVisible) {
          this.scrollListToBottom();
        } else {
          this.scrollListToTop();
        }
      } else {
        //this.markerNode = ReactDOM.findDOMNode(this.refs.newActivityMarker);
        //if (this.props.conversationObjects.length - prevProps.conversationObjects.length === 1) {
        //  this.newActivityTimer = 5;
        //  this.showNewActivityMarker();
        //}
      }

    }

    //this.adjustConversationListHeight();
    //
    //if (ConversationObjectList.shouldMarkAsSeen(prevProps, this.props)) {
    //  this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    //}
  }

  toggleConversationMembersView() {
    this.setState({ isConversationMembersViewVisible: !this.state.isConversationMembersViewVisible});
  }

  onCommentFormResize(commentBoxHeight) {
    //$(this.commentFormNode).css('height',commentBoxHeight);
    //const listNodeBottomOffset = commentBoxHeight + parseInt($(this.commentFormNode).css('bottom').split('px')[0]);
    //$(this.listNode).css('bottom', listNodeBottomOffset + 'px');
    //$(this.newActivityMarkerNode).css('bottom', (listNodeBottomOffset + 5) + 'px');
    const timelineHeader = this.refs.timelineHeaderContainer;
    const listElement = this.refs.conversationObjectList;
    //listElement.style.height = commentBoxHeight + 'px';
    //console.log(timelineHeader, listElement, timelineHeader.offsetHeight, commentBoxHeight);
    listElement.setAttribute("style", "height:" + (window.innerHeight - (timelineHeader.offsetHeight + 190) - commentBoxHeight) + "px");
    //this.setState({ commentFormHeight: commentBoxHeight });
  }

  renderListContainerContent() {
    if (this.state.isConversationMembersViewVisible) {
      return <div className={styles.memberList}><ConversationMemberListApp toggleConversationMembersView={this.toggleConversationMembersView}/></div>;
    }

    return this.renderConversationTimeLine();
  }

  renderConversationTimeLine() {
    const { conversationObjects, createComment, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
        canCreateDeliverable, visitAgendaItem, visitDeliverable, visitConversation } = this.props;

    const headerActions = { archiveAgendaItem, visitAgendaItem, updateAgendaItem, visitConversation, archiveDeliverable, updateDeliverable };

    var showMore = this.prepareShowMore(isFetching, nextPageUrl);
    var conversationObjectElements = this.prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, commentForm.parent, commentForm.currentUser);

    const _this = this;

    return (
      <div className={styles.root}>
        <div ref="timelineHeaderContainer">
          <TimelineHeader parent={commentForm.parent} {...headerActions} />
        </div>
        <div ref="conversationObjectList" className={styles.list}>
          { showMore }
          { conversationObjectElements }
        </div>
        <div ref="listFooter" className={styles.listFooter}>
          <CommentForm createComment={createComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable} onResize={this.onCommentFormResize} {...commentForm} />
        </div>
        <div ref="newActivityMarker" styleName="timeline-new-activity-marker">
            <span onClick={_this.scrollDownToNewActivity} styleName="timeline-new-activity-scroll">
              <i styleName="timeline-new-activity-scroll-icon"></i>
            </span>
        </div>
      </div>
    );
  }

  render() {
    const { users } = this.props;

    return(
      <div className={styles.listContainer}>
        <ConversationHeader chatType={this.props.commentForm.parent.type} usersCount={users ? users.size : 0} onToggleConversationMembersView={this.toggleConversationMembersView} />
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
