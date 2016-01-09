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
import { fillConversationObject, fillAgendaItem } from '../utils/entityUtils';

class AgendaItemApp extends React.Component {
  /*
   * This is called when the component is first mounted to the DOM.
   *
   * Here we fetch the conversation Objects for the agendaItemId (from the route) and set the selectedAgendaItemId in
   * the store using the selectAgendaItem ActionCreator. That is the same ActionCreator that is used when you click
   * on an agenda item to select it.
   */
  componentDidMount() {
    const { conversationId, agendaItemId } = this.props.params;
    this.props.selectAgendaItem(conversationId, agendaItemId);
  }

  componentDidUpdate(prevProps) {
    const { conversationId, agendaItemId } = this.props.params;
    const oldId = prevProps.params.agendaItemId;

    if (agendaItemId !== oldId) {
      this.props.selectAgendaItem(conversationId, agendaItemId);
    }
  }

  render() {
    const { conversationObjectsList } = this.props;
    if (conversationObjectsList.conversationObjects) {
      return (
        <ConversationObjectList
          {...this.props}
          {...conversationObjectsList}
        />
      );
    }

    return <div className="text-center"><h5>Loading Agenda Item...</h5></div>;
  }
}

function prepareConversationObjectList(state, objectsToShow, parentObject, canCreateAgendaItem, canCreateDeliverable) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const conversationObjectsList = {commentForm: {}};

  if (objectsToShow) {
    conversationObjectsList.conversationObjects = objectsToShow.get('references').map((objectReference) => {
      return fillConversationObject(state, objectReference);
    }).toList().sortBy((conversationObject) => {
      return conversationObject.createdAt;
    }).toJS();

    if (parseInt(decodeURIComponent(objectsToShow.get('nextPageUrl')).split("page[size]=")[1]) == 0) {
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
  const selectedAgendaItemId = state.getIn(['selectedConversationObject', 'type']) === 'agendaItems' ? state.getIn(['selectedConversationObject', 'id']) : null;
  const objectsToShow = state.getIn(['conversationObjectsByAgendaItem', selectedAgendaItemId]);
  const selectedAgendaItem = selectedAgendaItemId ? fillAgendaItem(state, selectedAgendaItemId) : null;
  const conversationObjectsList = prepareConversationObjectList(state, objectsToShow, selectedAgendaItem, false, true);

  return {
    conversationObjectsList,
    currentConversation: selectors.currentConversation(state),
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemApp);
