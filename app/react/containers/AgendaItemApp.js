import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as selectors from '../utils/selectors';

import ConversationObjectList from '../components/ConversationObjectList';
import { fillAgendaItem } from '../utils/entityUtils';

class AgendaItemApp extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.agendaItemId !== prevProps.params.agendaItemId) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { conversationId, agendaItemId } = this.props.params;
    this.props.selectAgendaItem(conversationId, agendaItemId);
  };

  render() {
    if (this.props.conversationObjects) { return <ConversationObjectList {...this.props} />; }

    return <div className="text-center"><h5>Loading Agenda Item...</h5></div>;
  }
}

function selectedAgendaItem(state) {
  const selectedAgendaItemId = state.getIn(['selectedConversationObject', 'type']) === 'agendaItems' ? state.getIn(['selectedConversationObject', 'id']) : null;
  return selectedAgendaItemId ? fillAgendaItem(state, selectedAgendaItemId) : null;
}

function objectsToShow(state) {
  const selectedAgendaItemId = state.getIn(['selectedConversationObject', 'type']) === 'agendaItems' ? state.getIn(['selectedConversationObject', 'id']) : null;
  return state.getIn(['conversationObjectsByAgendaItem', selectedAgendaItemId]);
}

function isFetching(state) {
  const list = objectsToShow(state);
  return list ? list.get('isFetching') : false;
}

function nextPageUrl(state) {
  const list = objectsToShow(state);
  if (list && parseInt(decodeURIComponent(list.get('nextPageUrl')).split("page[size]=")[1]) !== 0) {
    return list.get('nextPageUrl');
  }
}

function mapStateToProps(state) {
  return {
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: selectedAgendaItem(state),
      canCreateAgendaItem: false,
      canCreateDeliverable: true,
    },
    users: selectors.conversationMembers(state),
    canCreateAgendaItem: false,
    canCreateDeliverable: true,
    isFetching: isFetching(state),
    nextPageUrl: nextPageUrl(state),
    currentConversation: selectors.currentConversation(state),
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemApp);
