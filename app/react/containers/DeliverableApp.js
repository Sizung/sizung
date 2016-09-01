import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from '../components/Spinner';

import * as OrganizationActions from '../actions/organizations';
import * as ConversationActions from '../actions/conversations';
import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as AttachmentActions from '../actions/attachments';
import * as selectors from '../utils/selectors';
import * as deliverableUtils from '../utils/deliverableUtils.js';

import ConversationLayoutApp from './ConversationLayoutApp';
import ConversationObjectList from '../components/ConversationObjectList';
import { fillDeliverable } from '../utils/entityUtils';
import DeliverableList from '../components/DeliverableList';
import * as labels from '../utils/entityLabels';

class DeliverableApp extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.deliverableId !== prevProps.params.deliverableId) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { deliverableId } = this.props.params;
    this.props.fetchDeliverable(deliverableId);
  };

  render() {
    const { commentForm, deliverables, deliverable, visitDeliverable, updateDeliverable, archiveDeliverable, labels } = this.props;
    const { parent } = commentForm;

    if (parent) {
      // TODO: fix naming. The commentForm.parent is a deliverable in this container.
      const conversationId = deliverableUtils.getConversationIdFromParent(parent.parent);

      return (
        <ConversationLayoutApp currentTimeline={'deliverable'} labels={labels} conversationId={conversationId} selectedAgendaItemId={parent.parentId} selectedDeliverableId={parent.id} right={ <DeliverableList currentTimeline={'deliverable'} deliverables={ deliverables } selectedDeliverableId={deliverable ? deliverable.id : null} visitDeliverable={ visitDeliverable } updateDeliverable={ updateDeliverable } archiveDeliverable={ archiveDeliverable } currentUser={commentForm.currentUser} labels={labels}/> }>
          <ConversationObjectList {...this.props} />
        </ConversationLayoutApp>
      );
    }

    return <Spinner />;
  }
}

function objectsToShow(state, props) {
  return state.getIn(['conversationObjectsByDeliverable', props.params.deliverableId]);
}

function isFetching(state, props) {
  const list = objectsToShow(state, props);
  return list ? list.get('isFetching') : false;
}

function nextPageUrl(state, props) {
  const list = objectsToShow(state, props);
  if (list && parseInt(decodeURIComponent(list.get('nextPageUrl')).split("page[size]=")[1]) !== 0) {
    return list.get('nextPageUrl');
  }
}

function mapStateToProps(state, props) {
  const deliverable = fillDeliverable(state, props.params.deliverableId);

  let deliverables = null;
  switch(deliverable ? deliverable.parentType : null) {
    case 'agendaItems':
      deliverables = selectors.deliverablesForAgendaItem(state, deliverable.parentId);
      break;
    case 'conversations':
      deliverables = selectors.deliverablesForConversationOnly(state, deliverable.parentId);
      break;
  }

  const deliverableParent = deliverable ? deliverable.parent : null;
  const conversationSettingsViewState = selectors.conversationSettingsViewState(state);
  return {
    deliverable,
    deliverables,
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state, props)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: deliverable,
    },
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: deliverableParent ? deliverableUtils.getConversationIdFromParent(deliverableParent) : null,
    currentConversation: selectors.currentConversation(state),
    conversationMembers: selectors.conversationMembers(state),
    conversationSettingsViewState,
    navigationHistory: selectors.navigationHistory(state),
    labels: labels.organizationObjectsLabels(state),
    conversations: selectors.conversationsForOrganization(state, selectors.currentConversation(state).organizationId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationActions, ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions, ...AttachmentActions, ...OrganizationActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableApp);
