import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as ConversationActions from '../actions/conversations';
import * as selectors from '../utils/selectors';

import ConversationObjectList from '../components/ConversationObjectList';
import ConversationLayoutApp from './ConversationLayoutApp';
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
    const { agendaItemId } = this.props.params;
    this.props.selectAgendaItem(agendaItemId);
  };

  render() {
    const { commentForm } = this.props;
    const { parent } = commentForm;

    if (parent) {
      return (
        <ConversationLayoutApp conversationId={parent.conversationId} selectedAgendaItemId={parent.id}>
          <ConversationObjectList {...this.props} />
        </ConversationLayoutApp>
      );
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
  const agendaItem = fillAgendaItem(state, props.params.agendaItemId);
  const conversationMembersViewVisible = selectors.conversationMemberListVisible(state);
  return {
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state, props)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: agendaItem,
      canCreateAgendaItem: true,
      canCreateDeliverable: true,
    },
    canCreateAgendaItem: true,
    canCreateDeliverable: true,
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: agendaItem ? agendaItem.conversationId : null,
    currentConversation: selectors.currentConversation(state),
    conversationMembers: selectors.conversationMembers(state),
    conversationMembersViewVisible,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions, ...ConversationActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemApp);
