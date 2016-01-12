import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as selectors from '../utils/selectors';

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
    const { conversationId, agendaItemId, deliverableId } = this.props.params;
    this.props.selectDeliverable(conversationId, agendaItemId, deliverableId);
  };

  render() {
    const { conversationObjects, commentForm } = this.props;
    const { parent } = commentForm;
    if (conversationObjects && parent) {
      return <ConversationObjectList {...this.props} />;
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
  return {
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state, props)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: fillDeliverable(state, props.params.deliverableId),
      canCreateAgendaItem: false,
      canCreateDeliverable: false,
    },
    users: selectors.conversationMembers(state),
    canCreateAgendaItem: false,
    canCreateDeliverable: false,
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: props.params.conversationId,
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableApp);
