import React, { Component, PropTypes } from 'react';
import ComposeContainer from './../ComposeContainer';
import Comment from './../Comment/index';
import Attachment from './../Attachment';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import styles from './ConversationObjectList.css';
import TimelineHeader from '../TimelineHeader/index';
import ConversationHeader from '../ConversationHeader';
import ConversationSettingsApp from '../../containers/ConversationSettingsApp';

class ConversationObjectList extends Component {

  constructor() {
    super();

    this.state = {
      newObjects: 0,
    };
    this.newObjectsMarkerSeen = false;
  }

  componentDidMount() {
    const root = this.refs.root;
    if (root) {
      this.refs.root.addEventListener('scroll', this.handleScroll);
      if (this.refs.newObjectsMarker && !this.newObjectsMarkerSeen) {
        this.refs.newObjectsMarker.scrollIntoView({ block: 'end', behavior: 'smooth' });
      } else {
        this.scrollListToBottom();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const unseenObjectsList = nextProps.conversationObjects.filter((obj) => {
      return obj.unseen;
    });
    if (nextProps.conversationObjects && unseenObjectsList.length === nextProps.conversationObjects.length && nextProps.nextPageUrl) {
      this.handleShowMore();
    }
  }

  componentWillUpdate(nextProps) {
    const root = this.refs.root;
    if (root) {
      this.shouldScrollBottom = this.isScrolledToBottom(root);
    }
    if (this.props.conversationObjects && this.props.conversationObjects.length > 0 && nextProps.conversationObjects && nextProps.conversationObjects.length > 0) {
      const oldListLastObjectTimestamp = (new Date(this.props.conversationObjects[this.props.conversationObjects.length - 1].createdAt)).getTime();

      const newListLastObjectTimestamp = (new Date(nextProps.conversationObjects[nextProps.conversationObjects.length - 1].createdAt)).getTime();

      if (oldListLastObjectTimestamp < newListLastObjectTimestamp && this.props.conversationObjects.length < nextProps.conversationObjects.length) {
        this.setState({ newObjects: this.state.newObjects + (nextProps.conversationObjects.length - this.props.conversationObjects.length) });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (ConversationObjectList.shouldMarkAsSeen(prevProps, this.props)) {
      this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    }

    if (this.refs.newObjectsMarker && !this.newObjectsMarkerSeen) {
      this.refs.newObjectsMarker.scrollIntoView();
      this.newObjectsMarkerSeen = true;
    } else if (this.shouldScrollBottom) {
      this.scrollListToBottom();
    }
  }

  componentWillUnmount() {
    const root = this.refs.root;
    if (root) {
      if (this.props.commentForm.parent) {
        this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
      }
      this.refs.root.removeEventListener('scroll', this.handleScroll);
    }
  }

  getConversationObjectOwnerId = (obj) => {
    return (obj.type === 'comments' ? obj.authorId : obj.ownerId);
  };

  shouldShowTimeStamp = (currentConversationObject, nextConversationObject, showOwner) => {
    if (!showOwner) {
      if (!currentConversationObject.archived && currentConversationObject.createdAt === currentConversationObject.updatedAt) {
        const currentObjectTimeStamp = (new Date(currentConversationObject.createdAt)).getTime();
        const nextObjectTimeStamp = (new Date(nextConversationObject.createdAt)).getTime();
        if (((nextObjectTimeStamp - currentObjectTimeStamp) / (1000 * 60)) < 15) {
          return false;
        }
        return true;
      }
      return true;
    }
    return true;
  };

  prepareChildElements = (conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, parent, currentUser) => {
    if (conversationObjects) {
      let ownerId = null;
      let showOwner = false;
      return conversationObjects.map((conversationObject, index) => {

        const uid = this.getConversationObjectOwnerId(conversationObject);
        if (uid !== ownerId) {
          ownerId = uid;
          showOwner = true;
        } else {
          showOwner = false;
        }

        const showTimeStamp = (index < (conversationObjects.length - 1) ? this.shouldShowTimeStamp(conversationObject, conversationObjects[index + 1], showOwner) : true);

        if (conversationObject.type === 'comments') {
          const comment = conversationObject;
          comment.parent = parent;
          return (<Comment key={comment.id} comment={comment} showAuthor={showOwner}
                           showTimeStamp={showTimeStamp} currentUser={currentUser}
                           updateComment={updateComment} deleteComment={deleteComment}
                           createAgendaItem={createAgendaItem}
                           createDeliverable={createDeliverable}
              />);
        } else if (conversationObject.type === 'agendaItems') {
          const agendaItem = conversationObject;
          return (<AgendaItemInTimeline key={agendaItem.id} showOwner={showOwner}
                                        showTimeStamp={showTimeStamp} currentUser={currentUser}
                                        agendaItem={agendaItem} visitAgendaItem={visitAgendaItem}
                                        archiveAgendaItem={archiveAgendaItem}
                                        updateAgendaItem={updateAgendaItem}
              />);
        } else if (conversationObject.type === 'attachments') {
          const attachment = conversationObject;
          return (<Attachment key={attachment.id} showOwner={showOwner}
                              showTimeStamp={showTimeStamp} attachment={attachment}/>);
        } else if (conversationObject.type === 'deliverables') {
          const deliverable = conversationObject;
          return (<DeliverableInTimeline key={deliverable.id} showOwner={showOwner}
                                         showTimeStamp={showTimeStamp} currentUser={currentUser}
                                         deliverable={deliverable}
                                         visitDeliverable={visitDeliverable}
                                         archiveDeliverable={archiveDeliverable}
                                         updateDeliverable={updateDeliverable}/>);
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

  isScrolledToBottom = (element) => {
    // A tolerance of +/- 5px to avoid issues due to pixel calculations of scroll height based on rem heights if any
    return (Math.abs(element.scrollTop + element.offsetHeight - element.scrollHeight) <= 5);
  };

  handleScroll = (evt) => {
    const root = this.refs.root;
    if (root && this.isScrolledToBottom(root) && this.state.newObjects > 0) {
      this.setState({ newObjects: 0 });
    }
  };

  scrollListToBottom = () => {
    const root = this.refs.root;
    if (root) {
      root.scrollTop = root.scrollHeight;
    }
  };

  static shouldMarkAsSeen = (prevProps, props) => {
    const notHandledByMount = ((!!prevProps.conversationObjects === false || !!prevProps.commentForm.parent === false) && (!!props.conversationObjects === true && !!props.commentForm.parent === true));

    const unseenPrev = prevProps.conversationObjects ? prevProps.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    const unseenNow = props.conversationObjects ? props.conversationObjects.some((obj) => { return obj.unseen; }) : false;
    return (notHandledByMount || !unseenPrev && unseenNow || prevProps.commentForm.parent.id !== props.commentForm.parent.id && unseenNow);
  };

  handleShowMore = (e) => {
    if (e) {
      e.preventDefault();
    }
    const parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

    this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
  };

  checkAndInsertNewObjectsMarker = (conversationObjectElements, conversationObjects) => {
    let newObjectsMarker;
    let newObjectsMarkerIndex = -1;
    const { nextPageUrl } = this.props;
    if (!nextPageUrl && conversationObjects.length > 0 && conversationObjects[0].unseen) {
      newObjectsMarkerIndex = 0;
    } else {
      conversationObjects.forEach((conversationObject, index) => {
        if (!conversationObject.unseen && index < (conversationObjects.length - 1) && conversationObjects[index + 1].unseen) {
          newObjectsMarkerIndex = index + 1;
          return false;
        }
      });
    }
    newObjectsMarker = this.newObjectsMarker(conversationObjects.filter((obj) => {
      return obj.unseen;
    }).length);

    if (newObjectsMarker) {
      return conversationObjectElements.filter((obj, index) => {
        return index < newObjectsMarkerIndex;
      }).concat(newObjectsMarker).concat(
          conversationObjectElements.filter((obj, index) => {
            return index >= newObjectsMarkerIndex;
          })
      );
    }
    return conversationObjectElements;
  };

  renderConversationTimeLine = () => {
    const { conversationObjects, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable, commentForm, isFetching, nextPageUrl,
        visitAgendaItem, visitDeliverable } = this.props;

    const showMore = this.prepareShowMore(isFetching, nextPageUrl);
    let conversationObjectElements = this.prepareChildElements(conversationObjects, updateComment, deleteComment, archiveAgendaItem, updateAgendaItem, archiveDeliverable, updateDeliverable, createAgendaItem, createDeliverable, visitAgendaItem, visitDeliverable, commentForm.parent, commentForm.currentUser);
    if (conversationObjects && conversationObjectElements) {
      conversationObjectElements = this.checkAndInsertNewObjectsMarker(conversationObjectElements, conversationObjects);
    }
    return (
      <div ref="root" className={styles.root}>
        <div ref="conversationObjectList" className={styles.list}>
          { showMore }
          { conversationObjectElements }
        </div>
      </div>
    );
  };

  newObjectsMarker = (newObjectsCount) => {
    if (newObjectsCount > 0) {
      return (
          <div ref='newObjectsMarker' className={styles.newObjectsMarkerContainer}>
            <div className={styles.newObjectsMarkerLabel}>
              { newObjectsCount + ' new comment' + (newObjectsCount === 1 ? '' : 's')}
            </div>
            <hr className={styles.newObjectsMarkerLine}/>
          </div>
      );
    }
    return undefined;
  };

  render() {
    const { createComment, createAgendaItem, createDeliverable, commentForm, createAttachment } = this.props;
    const root = this.refs.root;

    if (this.props.conversationSettingsViewState === 'edit') {
      return (
          <div className={styles.listContainer}>
            <ConversationSettingsApp conversationSettingsViewState={this.props.conversationSettingsViewState}/>
          </div>
      );
    }

    return (
        <div className={styles.listContainer}>
          <ConversationHeader conversation={this.props.currentConversation}
                              updateConversation={this.props.updateConversation}
                              currentConversationObject={this.props.commentForm.parent} chatType={this.props.commentForm.parent.type}
                              conversationSettingsViewState={this.props.conversationSettingsViewState}
                              deleteConversation={this.props.deleteConversation}
                              navigationHistory={this.props.navigationHistory}
                              visitAgendaItem={this.props.visitAgendaItem}
                              visitDeliverable={this.props.visitDeliverable}
                              visitConversation={this.props.visitConversation}
                              visitOrganization={this.props.visitOrganization}
          />
          <TimelineHeader parent={commentForm.parent} />
          {this.renderConversationTimeLine()}
          <ComposeContainer createComment={createComment}
                            createAgendaItem={createAgendaItem}
                            createDeliverable={createDeliverable}
                            createAttachment={createAttachment}
                            handleNewObjectMarkerClick={this.scrollListToBottom}
                            newObjects={ this.state.newObjects > 0 && root && !this.isScrolledToBottom(root) ? this.state.newObjects : 0 }
                            {...commentForm}
          />
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
  updateAgendaItem: PropTypes.func.isRequired,
  visitConversation: PropTypes.func,
  visitOrganization: PropTypes.func,
  deleteConversation: PropTypes.func.isRequired,
  createAttachment: PropTypes.func.isRequired,
  navigationHistory: PropTypes.object,
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false,
};

export default ConversationObjectList;
