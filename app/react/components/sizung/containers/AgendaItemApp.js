import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';

import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';
import * as DeliverableActions from '../actions/deliverables';

import AgendaItemListApp from './AgendaItemListApp';
import DeliverableListApp from './DeliverableListApp';
import ConversationObjectListApp from './ConversationObjectListApp';
import UserListApp from './UserListApp';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import DeliverableInTimeline from '../components/DeliverableInTimeline';
import AgendaItemInTimeline from '../components/AgendaItemInTimeline';
import {fillConversationObject, fillAgendaItem} from '../utils/entityUtils';
import ApplicationLayout from '../components/ApplicationLayout';
import ConversationObjectList from '../components/ConversationObjectList';

class AgendaItemApp extends React.Component {
  constructor() {
    super();

    this.handleBackClick = (e) => {
      e.preventDefault();

      this.props.backToConversation(this.props.currentConversation.id);
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedAgendaItemId !== this.props.selectedAgendaItemId || nextProps.conversationObjectsList !== this.props.conversationObjectsList;
  }

  render() {
    const { selectedAgendaItem, closeAgendaItem, conversationObjectsList, currentConversation, currentUser } = this.props;
    if(selectedAgendaItem) {
      return (<div>
        <Button href="#" onClick={this.handleBackClick}>Close</Button>
        <AgendaItemInTimeline agendaItem={selectedAgendaItem}/>
        <ConversationObjectListApp {...conversationObjectsList} currentConversation={currentConversation}/>
      </div>);
    }
    else {
      return <div>Loading...</div>;
    }
  }
}


function prepareConversationObjectList(state, objectsToShow, parentObject, canCreateAgendaItem, canCreateDeliverable) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  var conversationObjectsList = {commentForm: {}};

  if (objectsToShow) {
    conversationObjectsList.conversationObjects = objectsToShow.get('references').map(function(objectReference){
      return fillConversationObject(state, objectReference);
    }).toList().sortBy(function(conversationObject) {
      return conversationObject.createdAt;
    }).toJS();

    conversationObjectsList.nextPageUrl = objectsToShow.get('nextPageUrl');
    conversationObjectsList.isFetching = objectsToShow.get('isFetching');
    conversationObjectsList.commentForm.currentUser = currentUser;
    conversationObjectsList.commentForm.parent = parentObject;
    conversationObjectsList.commentForm.canCreateAgendaItem = canCreateAgendaItem;
    conversationObjectsList.commentForm.canCreateDeliverable = canCreateDeliverable;
  }

  return conversationObjectsList;
}

function mapStateToProps(state) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
  const selectedAgendaItemIdInState = state.getIn(['selectedConversationObject', 'id']);
  const selectedAgendaItemIdInPath = state.get('routing').path.split('/')[4];
  const selectedAgendaItemId = selectedAgendaItemIdInState;
  //if (selectedAgendaItemIdInPath != selectedAgendaItemIdInState) {
  //  state.dispatch(selectAgendaItemWithFetch(selectedAgendaItemIdInPath));
  //}
  console.log(selectedAgendaItemId);

  const selectedAgendaItem = selectedAgendaItemId ? fillAgendaItem(state, selectedAgendaItemId) : null;

  const objectsToShow = state.getIn(['conversationObjectsByAgendaItem', selectedAgendaItemId]);
  const conversationObjectsList = prepareConversationObjectList(state, objectsToShow, selectedAgendaItem, false, true);

  return {
    conversationObjectsList: conversationObjectsList,
    selectedAgendaItem: selectedAgendaItem,
    currentConversation: currentConversation,
    currentUser: currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaItemApp);