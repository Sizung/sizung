import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import ComposeContainer from './../ComposeContainer';
import Comment from './../Comment/index';
import Attachment from './../Attachment';
import AgendaItemInTimeline from './../AgendaItemInTimeline';
import DeliverableInTimeline from './../DeliverableInTimeline';
import Spinner from '../Spinner';
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
      newObjects: 0,
    };
    this.newObjectsMarkerSeen = false;
  }

  componentDidMount() {
    const root = this.refs.root;
    if (root) {
      this.refs.root.addEventListener('scroll', this.handleScroll);
      if (this.refs.newObjectsMarker && !this.newObjectsMarkerSeen) {
        //this.refs.newObjectsMarker.scrollIntoView({ block: 'start', behavior: 'smooth' });
        root.scrollTop = 0;
        root.scrollTop = ReactDOM.findDOMNode(this.refs.newObjectsMarker).offsetTop;
      } else {
        this.scrollListToBottom();
      }
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

      if (oldListLastObjectTimestamp < newListLastObjectTimestamp && this.props.conversationObjects.length < nextProps.conversationObjects.length && ((nextProps.conversationObjects.filter((obj) => { return obj.unseen; }).length > 0 && this.newObjectsMarkerSeen) || !this.newObjectsMarkerSeen)) {
        this.setState({ newObjects: this.state.newObjects + (nextProps.conversationObjects.length - this.props.conversationObjects.length) });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (ConversationObjectList.hasTimelineSwitched(prevProps, this.props)) {
      this.props.markAsSeen(prevProps.commentForm.parent.type, prevProps.commentForm.parent.id);
      this.newObjectsMarkerSeen = false;
    }

    if (this.refs.newObjectsMarker && !this.newObjectsMarkerSeen) {
      this.refs.root.scrollTop =  0;
      this.refs.root.scrollTop = ReactDOM.findDOMNode(this.refs.newObjectsMarker).offsetTop;
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

  prepareChildElements = () => {
    const { conversationObjects } = this.props;
    if (conversationObjects) {
      const filteredConvObject = _.filter(conversationObjects, obj => !obj.archived);
      const unseenCount = _.filter(conversationObjects, obj => obj.unseen).length;
      let firstUnseenIndex = -1;
      if (unseenCount) {
        firstUnseenIndex = filteredConvObject.length - unseenCount;
      }
      const groupedConvObjs = _.groupBy(filteredConvObject, (obj) => obj.createdAt.substr(0, 10));
      let objIndex = -1;
      return _.map(groupedConvObjs, (conObjs, date) => {
        const renderedConObjs = [];
        let ownerId;
        conObjs.forEach((conversationObject) => {
          objIndex += 1;
          if (objIndex === firstUnseenIndex) {
            renderedConObjs.push(this.newObjectsMarker(unseenCount));
          }
          renderedConObjs.push(this.prepareConversationObject(conversationObject, objIndex, objIndex === firstUnseenIndex, ownerId));
          ownerId = this.getConversationObjectOwnerId(conversationObject);
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
          {date && moment(date).calendar(null, momentDateFormats)}
        </div>
        <div className={styles.conversationDateLine}></div>
      </div>
    );
  }

  prepareConversationObject = (conversationObject, index, isFirstUnseen, ownerId) => {
    const { conversationObjects, updateComment, deleteComment, createAgendaItem, archiveAgendaItem, updateAgendaItem,
        createDeliverable, archiveDeliverable, updateDeliverable,
        visitAgendaItem, visitDeliverable, archiveAttachment, commentForm } = this.props;
    const { currentUser } = commentForm;
    let showOwner;
    const showTimeStamp = (index < (conversationObjects.length - 1) ? this.shouldShowTimeStamp(conversationObject, conversationObjects[index + 1], showOwner) : true);
    const unseenObjectMarkerRef = isFirstUnseen ? 'newObjectsMarker' : '';
    const uid = this.getConversationObjectOwnerId(conversationObject);

    if (uid !== ownerId) {
      showOwner = true;
    } else {
      showOwner = false;
    }

    if (conversationObject.type === 'comments') {
      const comment = conversationObject;
      comment.parent = parent;
      return (
        <Comment ref={unseenObjectMarkerRef} key={comment.id} comment={comment} showAuthor={showOwner}
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
    if (isFetching) {
      return <Spinner />;
    } else if (nextPageUrl) {
      return (
        <div className={styles.loadMoreMessageContainer}>
          <div className={styles.loadMoreMessage} onClick={this.handleShowMore}>
            Show More
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
    if (root && this.isScrolledToBottom(root) && this.state.newObjects > 0) {
      this.setState({ newObjects: 0 });
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
        <div ref="conversationObjectList" className={styles.list}>
          { showMore }
          { conversationObjectElements }
        </div>
      </div>
    );
  };

  newObjectsMarker = (newObjectsCount, isFirstObjectUnseen) => {
    if (newObjectsCount > 0) {
      return (
          <div ref={ isFirstObjectUnseen ? 'newObjectsMarker' : ''} className={styles.newObjectsMarkerContainer}>
            <div className={styles.newObjectsMarkerLabel}>
              { newObjectsCount + ' new comment' + (newObjectsCount === 1 ? '' : 's')}
            </div>
            <hr className={styles.newObjectsMarkerLine}/>
          </div>
      );
    }
    return undefined;
  };

  createNewComment = (obj) => {
    this.props.markAsSeen(this.props.commentForm.parent.type, this.props.commentForm.parent.id);
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
                              deleteConversation={this.props.deleteConversation}
                              navigationHistory={this.props.navigationHistory}
                              visitAgendaItem={this.props.visitAgendaItem}
                              visitDeliverable={this.props.visitDeliverable}
                              visitConversation={this.props.visitConversation}
                              visitOrganization={this.props.visitOrganization}
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
                            newObjects={ this.state.newObjects > 0 && root && !this.isScrolledToBottom(root) ? this.state.newObjects : 0 }
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
