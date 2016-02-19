import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import styles from './index.css';
import TimelineHeader from '../TimelineHeader/index';
import ConversationHeader from '../ConversationHeader';

class ConversationObjectList extends Component {
  constructor() {
    super();

    this.state = {
      isConversationMembersViewVisible: false,
      commentFormHeight: 40,
    };
  }

  componentDidMount() {
    const listNode = this.refs.conversationObjectList;
    if (listNode) {
      if (this.props.commentForm.parent) {
        this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
      }
      this.scrollListToBottom();
    }

    this.onCommentFormResize(this.state.commentFormHeight);
    window.addEventListener('resize', () => { this.onCommentFormResize(this.state.commentFormHeight); });
  }

  componentWillUpdate() {
    const listNode = this.refs.conversationObjectList;
    if (listNode) {
      this.shouldScrollBottom = (Math.abs(listNode.scrollTop + listNode.offsetHeight - listNode.scrollHeight) <= 82); // 20px is the offset tolerance considering borders and padding
    }
  }

  componentDidUpdate(prevProps) {
    const listNode = this.refs.conversationObjectList;
    if (listNode !== null) {
      const shouldScrollBottom = (Math.abs(listNode.scrollTop + listNode.offsetHeight - listNode.scrollHeight) <= 82); // 82px is the offset tolerance considering borders and padding
      if (shouldScrollBottom) {
        if (!this.state.isConversationMembersViewVisible) {
          this.scrollListToBottom();
        } else {
          this.scrollListToTop();
        }
      }

      if ((this.props.conversationObjects ? this.props.conversationObjects.length : 0) - (prevProps.conversationObjects ? prevProps.conversationObjects.length : 0) > 1) {
        this.scrollListToBottom();
      }
    }

    if (this.shouldScrollBottom) {
      if (!this.state.isConversationMembersViewVisible) {
        this.scrollListToBottom();
      } else {
        this.scrollListToTop();
      }
    }

    if (ConversationObjectList.shouldMarkAsSeen(prevProps, this.props)) {
      this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    }
  }

  onCommentFormResize = (commentBoxHeight) => {
    // $(this.commentFormNode).css('height',commentBoxHeight);
    // const listNodeBottomOffset = commentBoxHeight + parseInt($(this.commentFormNode).css('bottom').split('px')[0]);
    // $(this.listNode).css('bottom', listNodeBottomOffset + 'px');
    // $(this.newActivityMarkerNode).css('bottom', (listNodeBottomOffset + 5) + 'px');
    const timelineHeader = this.refs.timelineHeaderContainer;
    const listElement = this.refs.conversationObjectList;
    // listElement.style.height = commentBoxHeight + 'px';
    // console.log(timelineHeader, listElement, timelineHeader.offsetHeight, commentBoxHeight);
    listElement.setAttribute('style', 'height:' + (window.innerHeight - (timelineHeader.offsetHeight + 190) - commentBoxHeight) + 'px');
    // this.setState({ commentFormHeight: commentBoxHeight });
  };

  prepareChildElements = (conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, parent, currentUser) => {
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
          return <AgendaItemInTimeline key={agendaItem.id} showOwner={showOwner} currentUser={currentUser} agendaItem={agendaItem} visitAgendaItem={visitAgendaItem} archiveAgendaItem={archiveAgendaItem} updateAgendaItem={updateAgendaItem} isTimelineHeader={false}/>;
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} showOwner={showOwner} currentUser={currentUser}  deliverable={deliverable} visitDeliverable={visitDeliverable} archiveDeliverable={archiveDeliverable} updateDeliverable={updateDeliverable} isTimelineHeader={false}/>;
        }
        console.warn('Component not found for conversationObject: ', conversationObject);
      });
    }
  };

  prepareShowMore = (isFetching, nextPageUrl) => {
    if (isFetching) {
      return <div className={styles.loadingMessage}>Loading...</div>;
    } else if (nextPageUrl) {
      return <div className={styles.loadMoreMessage}><a className={styles.link} href="#" onClick={this.handleShowMore}>Show More</a></div>;
    }
  };

  handleCommentSettingsDropdownScroll = (commentGearIconNode) => {
    // if (commentGearIconNode && this.commentFormNode) {
    //   if (($(commentGearIconNode).offset().top + $(commentGearIconNode).outerHeight()) - $(this.commentFormNode).offset().top > 0) {
    //     this.listNode.scrollTop += $(commentGearIconNode).outerHeight();
    //   }
    // }
  };

  scrollListToBottom = () => {
    window.requestAnimationFrame(() => {
      const listNode = this.refs.conversationObjectList;
      if (listNode) {
        listNode.scrollTop = listNode.scrollHeight;
      }
    });
  };

  scrollListToTop = () => {
    window.requestAnimationFrame(() => {
      const listNode = this.refs.conversationObjectList;
      if (listNode) {
        listNode.scrollTop = 0;
      }
    });
  };

  static shouldMarkAsSeen = (prevProps, props) => {
    const notHandledByMount = ((!!prevProps.conversationObjects === false || !!prevProps.commentForm.parent === false) && (!!props.conversationObjects === true && !!props.commentForm.parent === true));

    const unseenPrev = prevProps.conversationObjects ? prevProps.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    const unseenNow = props.conversationObjects ? props.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    return (notHandledByMount || !unseenPrev && unseenNow || prevProps.commentForm.parent.id !== props.commentForm.parent.id && unseenNow);
  };

  handleShowMore = (e) => {
    let parentType;
    e.preventDefault();
    parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

    this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
  };

  renderConversationTimeLine = () => {
    const { conversationObjects, createComment, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
        canCreateDeliverable, visitAgendaItem, visitDeliverable, visitConversation } = this.props;

    const headerActions = { archiveAgendaItem, visitAgendaItem, updateAgendaItem, visitConversation, archiveDeliverable, updateDeliverable };

    const showMore = this.prepareShowMore(isFetching, nextPageUrl);
    const conversationObjectElements = this.prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, commentForm.parent, commentForm.currentUser);

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
      </div>
    );
  };

  render() {
    return (
      <div className={styles.listContainer}>
        <ConversationHeader parent={this.props.commentForm.parent} chatType={this.props.commentForm.parent.type} />
        {this.renderConversationTimeLine()}
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
  updateAgendaItem: PropTypes.func.isRequired,
  visitConversation: PropTypes.func,
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false,
};

export default ConversationObjectList;
