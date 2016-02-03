import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as selectors from '../utils/selectors';

import ConversationLayoutApp from './ConversationLayoutApp';
import ConversationObjectList from '../components/ConversationObjectList';
import { fillDeliverable } from '../utils/entityUtils';

class DeliverableApp extends React.Component {
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
    const { conversationObjects, commentForm } = this.props;
    const { parent } = commentForm;
    if (parent) {
      if (conversationObjects) {
        return (
          <ConversationLayoutApp conversationId={parent.agendaItem.conversationId}>
            <ConversationObjectList {...this.props} />
          </ConversationLayoutApp>
        );
      }

      return (
        <ConversationLayoutApp conversationId={parent.agendaItem.conversationId}>
          <div className="text-center"><h5>Loading Deliverable...</h5></div>
        </ConversationLayoutApp>
      );
    }

    return <div className="text-center"><h5>Loading Deliverable...</h5></div>;
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
  const agendaItem = deliverable ? deliverable.agendaItem : null;

  return {
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state, props)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: deliverable,
      canCreateAgendaItem: false,
      canCreateDeliverable: false,
    },
    users: selectors.conversationMembers(state),
    canCreateAgendaItem: false,
    canCreateDeliverable: false,
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: agendaItem ? agendaItem.conversationId : null,
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableApp);
