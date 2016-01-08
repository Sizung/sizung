import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as selectors from '../utils/selectors';
import ConversationView from '../components/ConversationView';
import { fillConversationObject } from '../utils/entityUtils';
import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';

class ConversationApp extends React.Component {
  //componentDidMount() {
  //  console.log(this.props);
  //  const { conversationId, agendaItemId } = this.props.params;
  //  this.props.selectAgendaItem(conversationId, agendaItemId);
  //}
  //
  //componentDidUpdate(prevProps) {
  //  const { conversationId, agendaItemId } = this.props.params;
  //  const oldId = prevProps.params.agendaItemId;
  //
  //  if (agendaItemId !== oldId) {
  //    this.props.selectAgendaItem(conversationId, agendaItemId);
  //  }
  //}
  //
  render() {
    return <ConversationView {...this.props} />;
  }
}

function prepareConversationObjectList(state, objectsToShow, parentObject, canCreateAgendaItem, canCreateDeliverable) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const conversationObjectsList = { commentForm: {} };

  if (objectsToShow) {
    conversationObjectsList.conversationObjects = objectsToShow.get('references').map((objectReference) => {
      return fillConversationObject(state, objectReference);
    }).toList().sortBy((conversationObject) => {
      return conversationObject.createdAt;
    }).toJS();

    if (parseInt(decodeURIComponent(objectsToShow.get('nextPageUrl')).split('page[size]=')[1]) === 0) {
      conversationObjectsList.nextPageUrl = null;
    } else {
      conversationObjectsList.nextPageUrl = objectsToShow.get('nextPageUrl');
    }

    conversationObjectsList.isFetching = objectsToShow.get('isFetching');
    conversationObjectsList.commentForm.currentUser = currentUser;
    conversationObjectsList.commentForm.parent = parentObject;
    conversationObjectsList.commentForm.canCreateAgendaItem = canCreateAgendaItem;
    conversationObjectsList.commentForm.canCreateDeliverable = canCreateDeliverable;
    conversationObjectsList.canCreateAgendaItem = canCreateAgendaItem;
    conversationObjectsList.canCreateDeliverable = canCreateDeliverable;
    conversationObjectsList.users = selectors.conversationMembers(state);
  }

  return conversationObjectsList;
}

function mapStateToProps(state) {
  const objectsToShow = state.getIn(['conversationObjectsByConversation', state.getIn(['currentConversation', 'id'])]);
  const conversationObjectsList = prepareConversationObjectList(state, objectsToShow, selectors.currentConversation(state), true, false);

  return {
    conversationObjectsList,
    currentConversation: selectors.currentConversation(state),
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationApp);
