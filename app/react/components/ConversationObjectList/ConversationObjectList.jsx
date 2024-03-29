import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import ComposeContainer from './../ComposeContainer';
import Comment from './../Comment/index';
import Attachment from './../Attachment';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import moment from 'moment';
import styles from './ConversationObjectList.css';
import TimelineHeader from '../TimelineHeader/index';
import ConversationHeader from '../ConversationHeader';
import ConversationSettingsApp from '../../containers/ConversationSettingsApp';

const momentDateFormats = {
  lastDay: '[Yesterday]',
  sameDay: '[Today]',
  lastWeek: 'DD MMM YY',
  sameElse: 'DD MMM YY',
};

class ConversationObjectList extends Component {

  constructor() {
    super();

    this.state = {
      newObjectsCountWhileInsideTimeline: 0,
      newCommentsLineVisible: false,
      allowNewCommentsLine: true,
    };
  }

  hasUnseenConversationObjects = (conversationObjects) => {
    return (conversationObjects && conversationObjects.some((obj) => { return obj.unseen; }));
  };

  componentWillMount() {
    if (this.hasUnseenConversationObjects(this.props.conversationObjects)) {
      this.setState({ newCommentsLineVisible: true });
    }
  }

  componentDidMount() {
    const root = this.refs.root;
    if (root) {
      this.refs.root.addEventListener('scroll', this.handleScroll);
      if (this.refs.newObjectsMarker && this.state.newCommentsLineVisible) {
        ReactDOM.findDOMNode(this.refs.newObjectsMarker).scrollIntoView();
      } else {
        this.scrollListToBottom();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const hasTimelineSwitched = ConversationObjectList.hasTimelineSwitched(this.props, nextProps);
    const unseenPrev = this.hasUnseenConversationObjects(this.props.conversationObjects);
    const unseenNow = this.hasUnseenConversationObjects(nextProps.conversationObjects);

    const root = this.refs.root;
    if (root) {
      this.shouldScrollBottom = this.isScrolledToBottom(root);
    }
    if (this.props.conversationObjects && this.props.conversationObjects.length > 0 && nextProps.conversationObjects && nextProps.conversationObjects.length > 0) {
      const oldListLastObjectTimestamp = (new Date(this.props.conversationObjects[this.props.conversationObjects.length - 1].createdAt)).getTime();

      const newListLastObjectTimestamp = (new Date(nextProps.conversationObjects[nextProps.conversationObjects.length - 1].createdAt)).getTime();

      if (oldListLastObjectTimestamp < newListLastObjectTimestamp && this.props.conversationObjects.length < nextProps.conversationObjects.length) {
        this.setState({ newObjectsCountWhileInsideTimeline: this.state.newObjectsCountWhileInsideTimeline + (nextProps.conversationObjects.length - this.props.conversationObjects.length) });
      }
    }

    if (hasTimelineSwitched) {

      if (unseenPrev) {
        this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
      }
      if (unseenNow) {
        this.setState({ allowNewCommentsLine: true });
      }
    }

    if (unseenNow && !this.state.newCommentsLineVisible && this.state.allowNewCommentsLine) {
      this.setState({ newCommentsLineVisible: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const scrolledToBottomOnNewCommentMarkerClick = (this.state.newObjectsCountWhileInsideTimeline === 0 && prevState.newObjectsCountWhileInsideTimeline > 0);
    if (this.refs.newObjectsMarker && this.state.newCommentsLineVisible && (!scrolledToBottomOnNewCommentMarkerClick)) {
      ReactDOM.findDOMNode(this.refs.newObjectsMarker).scrollIntoView();
    } else if (this.shouldScrollBottom) {
      this.scrollListToBottom();
    }
  }

  componentWillUnmount() {
    const root = this.refs.root;
    if (root) {
      if (this.hasUnseenConversationObjects(this.props.conversationObjects) && !this.conversationDeleted) {
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

  prepareChildElements = () => {
    const { conversationObjects } = this.props;
    if (conversationObjects) {
      const filteredConvObjects = _.filter(conversationObjects, obj => !obj.archived);
      const unseenCount = _.filter(conversationObjects, obj => obj.unseen).length;
      let firstUnseenIndex = -1;
      let objIndex = -1;
      const groupedConvObjs = _.groupBy(filteredConvObjects, (obj) => obj.createdAt.substr(0, 10));
      return _.map(groupedConvObjs, (convObjs, date) => {
        const renderedConObjs = [];
        let uId;
        convObjs.forEach((conversationObject) => {
          objIndex += 1;
          let lastSeen = false;
          let showOwner = false;
          const ownerId = this.getConversationObjectOwnerId(conversationObject);

          if (ownerId !== uId) {
            uId = ownerId;
            showOwner = true;
          } else {
            showOwner = false;
          }
          if (objIndex === 0 && filteredConvObjects[objIndex].unseen && !(filteredConvObjects[objIndex].type === 'agendaItems' || filteredConvObjects[objIndex].type === 'deliverables')) {
            firstUnseenIndex = objIndex;
          } else if (!filteredConvObjects[objIndex].unseen && (objIndex + 1) < filteredConvObjects.length && filteredConvObjects[objIndex + 1].unseen && !(filteredConvObjects[objIndex+1].type === 'agendaItems' || filteredConvObjects[objIndex+1].type === 'deliverables')) {
            lastSeen = true;
            firstUnseenIndex = objIndex + 1;
          }

          if (firstUnseenIndex === objIndex && conversationObject.unseen && this.state.allowNewCommentsLine && this.state.newCommentsLineVisible) {
            renderedConObjs.push(this.newObjectsMarker(unseenCount, firstUnseenIndex === 0));
          }
          renderedConObjs.push(this.prepareConversationObject(conversationObject, objIndex, lastSeen, showOwner));
        });
        return (
          <div>
            {this.prepareDateSeparator(date)}
            {renderedConObjs}
          </div>
        );
      });
    }
  };

  prepareDateSeparator = (date) => {
    return (
      <div className={styles.conversationDateSection}>
        <div className={styles.conversationDateLine}></div>
        <div className={styles.conversationDate}>
          {date && moment.utc(date).calendar(null, momentDateFormats)}
        </div>
        <div className={styles.conversationDateLine}></div>
      </div>
    );
  }

  deleteConversation = (conversationId, organizationId, agendaItems, deliverables) => {
    this.conversationDeleted = true;
    this.props.deleteConversation(conversationId, organizationId, agendaItems, deliverables);
  }

  prepareConversationObject = (conversationObject, index, isLastSeen, showOwner) => {
    const { conversationObjects, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable,
        visitAgendaItem, visitDeliverable, archiveAttachment, commentForm } = this.props;
    const { currentUser } = commentForm;
    const showTimeStamp = (index < (conversationObjects.length - 1) ? this.shouldShowTimeStamp(conversationObject, conversationObjects[index + 1], showOwner) : true);
    const unseenObjectMarkerRef = isLastSeen ? 'newObjectsMarker' : '';

    if (conversationObject.type === 'comments') {
      const comment = conversationObject;
      comment.parent = parent;
      return (
        <Comment id='ani' ref={unseenObjectMarkerRef} key={comment.id} comment={comment} showAuthor={showOwner}
                       showTimeStamp={showTimeStamp} currentUser={currentUser}
                       updateComment={updateComment} deleteComment={deleteComment}
                       createAgendaItem={createAgendaItem}
                       createDeliverable={createDeliverable}
        />);
    } else if (conversationObject.type === 'agendaItems') {
      const agendaItem = conversationObject;
      return (
        <AgendaItemInTimeline ref={unseenObjectMarkerRef} key={agendaItem.id} showOwner={showOwner}
                                    showTimeStamp={showTimeStamp} currentUser={currentUser}
                                    agendaItem={agendaItem} visitAgendaItem={visitAgendaItem}
                                    archiveAgendaItem={archiveAgendaItem}
                                    updateAgendaItem={updateAgendaItem}
        />);
    } else if (conversationObject.type === 'attachments') {
      const attachment = conversationObject;
      return (
        <Attachment ref={unseenObjectMarkerRef} key={attachment.id} showOwner={showOwner}
                          archiveAttachment={archiveAttachment}
                          currentUser={currentUser} showTimeStamp={showTimeStamp} attachment={attachment}
        />);
    } else if (conversationObject.type === 'deliverables') {
      const deliverable = conversationObject;
      return (
        <DeliverableInTimeline ref={unseenObjectMarkerRef} key={deliverable.id} showOwner={showOwner}
                                     showTimeStamp={showTimeStamp} currentUser={currentUser}
                                     deliverable={deliverable}
                                     visitDeliverable={visitDeliverable}
                                     archiveDeliverable={archiveDeliverable}
                                     updateDeliverable={updateDeliverable}
        />);
    }
    return undefined;
  }

  prepareShowMore = (isFetching, nextPageUrl) => {
    if (isFetching || nextPageUrl) {
      return (
        <div className={styles.loadMoreMessageContainer}>
          <div className={styles.loadMoreMessage} onClick={this.handleShowMore}>
            {isFetching ? 'Loading' : 'Show More'}
          </div>
        </div>
      );
    }
  };

  isScrolledToBottom = (element) => {
    // A tolerance of +/- 20px to avoid issues due to pixel/dom calculations of scroll height if any
    return (Math.abs(element.scrollTop + element.offsetHeight - element.scrollHeight) <= 20);
  };

  handleScroll = (evt) => {
    const root = this.refs.root;
    if (root && this.isScrolledToBottom(root) && this.state.newObjectsCountWhileInsideTimeline > 0) {
      this.setState({ newObjectsCountWhileInsideTimeline: 0 });
    }
  };

  ifAlreadyAtBottomScrollListToBottom = () => {
    const root = this.refs.root;
    if (this.isScrolledToBottom(root)) {
      this.scrollListToBottom();
    }
  };

  scrollListToBottom = () => {
    const root = this.refs.root;
    if (root) {
      root.scrollTop = root.scrollHeight;
    }
  };

  static hasTimelineSwitched = (prevProps, props) => {
    return (prevProps.commentForm.parent.id !== props.commentForm.parent.id);
  };

  handleShowMore = (e) => {
    if (e) {
      e.preventDefault();
    }
    const parentType = this.props.commentForm.parent.type ? this.props.commentForm.parent.type : 'conversations';

    this.props.fetchConversationObjects(parentType, this.props.commentForm.parent.id, this.props.nextPageUrl);
  };

  nextObjectIsFirstUnseenObject = (conversationObject, conversationObjects, index) => {
    return (!conversationObject.unseen && index < (conversationObjects.length - 1) && conversationObjects[index + 1].unseen);
  };

  renderConversationTimeLine = () => {
    const { isFetching, nextPageUrl } = this.props;
    const showMore = this.prepareShowMore(isFetching, nextPageUrl);
    const conversationObjectElements = this.prepareChildElements();
    return (
      <div ref="root" className={styles.root}>
          { showMore }
          { conversationObjectElements }
      </div>
    );
  };

  newObjectsMarker = (newObjectsCount, isFirstObjectUnseen) => {
    if (newObjectsCount > 0) {
      return (
          <div ref={ isFirstObjectUnseen ? 'newObjectsMarker' : ''} className={styles.newObjectsMarkerContainer}>
            <div className={styles.newObjectsMarkerLabel}>
              New messages
            </div>
            <hr className={styles.newObjectsMarkerLine}/>
          </div>
      );
    }
    return undefined;
  };

  createNewComment = (obj) => {
    if (this.hasUnseenConversationObjects(this.props.conversationObjects)) {
      this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
    }
    this.setState({ allowNewCommentsLine: false });
    this.props.createComment(obj);
  };

  render() {
    const { createAgendaItem, createDeliverable, commentForm, createAttachment, archiveAttachment, params, labels } = this.props;
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
                              deleteConversation={this.deleteConversation}
                              navigationHistory={this.props.navigationHistory}
                              visitAgendaItem={this.props.visitAgendaItem}
                              visitDeliverable={this.props.visitDeliverable}
                              visitConversation={this.props.visitConversation}
                              visitOrganization={this.props.visitOrganization}
                              deliverables={this.props.deliverables}
                              agendaItems={this.props.agendaItems}
          />
          <TimelineHeader parent={commentForm.parent} />
          {this.renderConversationTimeLine()}
          <ComposeContainer createComment={this.createNewComment}
                            entityId={params && (params.deliverableId || params.agendaItemId)}
                            createAgendaItem={createAgendaItem}
                            createDeliverable={createDeliverable}
                            createAttachment={createAttachment}
                            archiveAttachment={archiveAttachment}
                            handleNewObjectMarkerClick={this.scrollListToBottom}
                            scrollListToBottom={this.ifAlreadyAtBottomScrollListToBottom}
                            newObjects={ this.state.newObjectsCountWhileInsideTimeline > 0 && root && !this.isScrolledToBottom(root) ? this.state.newObjectsCountWhileInsideTimeline : 0 }
                            labels={labels}
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
  archiveAttachment: PropTypes.func.isRequired,
  navigationHistory: PropTypes.object,
  labels: PropTypes.object.isRequired,
};

ConversationObjectList.defaultProps = {
  nextPageUrl: null,
  isFetching: false,
};

export default ConversationObjectList;
