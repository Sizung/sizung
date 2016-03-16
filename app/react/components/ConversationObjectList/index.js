import React, { Component, PropTypes } from 'react';
import CommentForm from './../CommentForm/index';
import Comment from './../Comment/index';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import styles from './index.css';
import TimelineHeader from '../TimelineHeader/index';
import ConversationHeader from '../ConversationHeader';
import ConversationMembersEditApp from '../../containers/ConversationMembersEditApp';

class ConversationObjectList extends Component {
  constructor() {
    super();

    this.state = {
      isConversationMembersViewVisible: false,
    };
  }

  componentDidMount() {
    const listNode = this.refs.conversationObjectList;
    if (listNode) {
      if (this.props.commentForm.parent) {
        this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
      }
    }
    this.scrollListToBottom();
  }

  componentWillUpdate() {
    const root = this.refs.root;
    if (root) {
      this.shouldScrollBottom = root.scrollTop + root.offsetHeight === root.scrollHeight;
    }
  }

  componentDidUpdate(prevProps) {
    if (ConversationObjectList.shouldMarkAsSeen(prevProps, this.props)) {
      this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    }

    if (this.shouldScrollBottom) {
      this.scrollListToBottom();
    }
  }

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
          return (<Comment key={comment.id} comment={comment} showAuthor={showOwner} currentUser={currentUser} handleCommentSettingsDropdownScroll={this.handleCommentSettingsDropdownScroll} updateComment={updateComment} deleteComment={deleteComment} createAgendaItem={createAgendaItem} createDeliverable={createDeliverable}/>);
        } else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return <AgendaItemInTimeline key={agendaItem.id} showOwner={showOwner} currentUser={currentUser} agendaItem={agendaItem} visitAgendaItem={visitAgendaItem} archiveAgendaItem={archiveAgendaItem} updateAgendaItem={updateAgendaItem} />;
        }
        if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return <DeliverableInTimeline key={deliverable.id} showOwner={showOwner} currentUser={currentUser}  deliverable={deliverable} visitDeliverable={visitDeliverable} archiveDeliverable={archiveDeliverable} updateDeliverable={updateDeliverable} />;
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
    const root = this.refs.root;
    if (root) {
      root.scrollTop = root.scrollHeight;
    }
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
    e.preventDefault();
    const parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

    this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
  };

  renderConversationTimeLine = () => {
    const { conversationObjects, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl, canCreateAgendaItem,
        canCreateDeliverable, visitAgendaItem, visitDeliverable, visitConversation } = this.props;

    const headerActions = { archiveAgendaItem, visitAgendaItem, updateAgendaItem, visitConversation, archiveDeliverable, updateDeliverable };

    const showMore = this.prepareShowMore(isFetching, nextPageUrl);
    const conversationObjectElements = this.prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, canCreateAgendaItem, canCreateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, commentForm.parent, commentForm.currentUser);

    return (
      <div ref="root" className={styles.root}>
        <div ref="timelineHeaderContainer">
          <TimelineHeader parent={commentForm.parent} {...headerActions} />
        </div>
        <div ref="conversationObjectList" className={styles.list}>
          { showMore }
          { conversationObjectElements }
        </div>
      </div>
    );
  };

  render() {
    const { createComment, createAgendaItem, createDeliverable, commentForm } = this.props;

    if (this.props.conversationMembersViewVisible) {
      return (
          <div className={styles.listContainer}>
            <ConversationMembersEditApp conversationMembersViewVisible={this.props.conversationMembersViewVisible}/>
          </div>
      );
    }

    return (
        <div className={styles.listContainer}>
          <ConversationHeader conversation={this.props.currentConversation}
                              updateConversation={this.props.updateConversation}
                              parent={this.props.commentForm.parent} chatType={this.props.commentForm.parent.type}
                              conversationMembersViewVisible={this.props.conversationMembersViewVisible}/>
          {this.renderConversationTimeLine()}
          <CommentForm createComment={createComment} createAgendaItem={createAgendaItem}
                       createDeliverable={createDeliverable} {...commentForm} />
        </div>
    );

  }
}

ConversationObjectList.propTypes = {
  currentConversation: PropTypes.object,
  updateConversation: PropTypes.func.isRequired,
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
