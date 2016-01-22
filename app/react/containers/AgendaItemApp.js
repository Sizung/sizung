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
    const { conversationObjects, commentForm } = this.props;
    const { parent } = commentForm;

    if (conversationObjects && parent) {
      return <ConversationObjectList {...this.props} />;
    }

    return <div className="text-center"><h5>Loading Agenda Item...</h5></div>;
  }
}

function objectsToShow(state, props) {
  return state.getIn(['conversationObjectsByAgendaItem', props.params.agendaItemId]);
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
      parent: fillAgendaItem(state, props.params.agendaItemId),
      canCreateAgendaItem: false,
      canCreateDeliverable: true,
    },
    users: selectors.conversationMembers(state),
    canCreateAgendaItem: false,
    canCreateDeliverable: true,
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: props.params.conversationId,
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemApp);
