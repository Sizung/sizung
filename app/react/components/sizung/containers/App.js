import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col } from 'react-bootstrap';

import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';
import * as DeliverableActions from '../actions/deliverables';

import AgendaItemListApp from './AgendaItemListApp';
import DeliverableListApp from './DeliverableListApp';
import ConversationObjectListApp from './ConversationObjectListApp';
import UserListApp from './UserListApp';
import CommentForm from '../components/CommentForm/index';
import Comment from '../components/Comment';
import DeliverableInTimeline from '../components/DeliverableInTimeline';
import AgendaItemInTimeline from '../components/AgendaItemInTimeline';
import {fillConversationObject, fillAgendaItem} from '../utils/entityUtils';
import ApplicationLayout from '../components/ApplicationLayout';
import ConversationObjectList from '../components/ConversationObjectList/index';

class App extends Component {

  render() {
    const { currentUser } = this.props;

    return (<ApplicationLayout currentUser={currentUser}>
                  <Row>
                    <Col xs={12}>
                      <Row>
                        <Col xs={12} md={3} className='zero-padding'>
                          <AgendaItemListApp />
                        </Col>
                        <Col xs={12} md={6} className='zero-padding'>
                         {this.props.children}
                        </Col>
                        <Col xs={12} md={3} className='zero-padding'>
                          <DeliverableListApp />
                        </Col>
                      </Row>
                    </Col>
                  </Row>		
            </ApplicationLayout>);
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
  const selectedAgendaItemId = state.getIn(['selectedConversationObject', 'id']);
  const selectedAgendaItem = selectedAgendaItemId ? fillAgendaItem(state, selectedAgendaItemId) : null;

  var conversationObjectsList;

  if (selectedAgendaItem) {
    const objectsToShow = state.getIn(['conversationObjectsByAgendaItem', selectedAgendaItemId]);
    conversationObjectsList = prepareConversationObjectList(state, objectsToShow, selectedAgendaItem, false, true);
  } else {
    const objectsToShow = state.getIn(['conversationObjectsByConversation', state.getIn(['currentConversation', 'id'])]);
    conversationObjectsList = prepareConversationObjectList(state, objectsToShow, currentConversation, true, false);
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(App);