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

class ConversationApp extends React.Component {
  constructor() {
    super();

    this.handleBackClick = (e) => {
      e.preventDefault();

      this.props.backToConversation(this.props.currentConversation.id);
    };
  }

  render() {
    const { conversationObjectsList, currentConversation } = this.props;
    if (conversationObjectsList.conversationObjects) {
      return <ConversationObjectListApp {...conversationObjectsList} currentConversation={currentConversation} />
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

  const objectsToShow = state.getIn(['conversationObjectsByConversation', state.getIn(['currentConversation', 'id'])]);
  const conversationObjectsList = prepareConversationObjectList(state, objectsToShow, currentConversation, true, false);

  return {
    conversationObjectsList: conversationObjectsList,
    currentConversation: currentConversation,
    currentUser: currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationApp);