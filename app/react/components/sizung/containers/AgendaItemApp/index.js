import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';

import * as CommentsActions from '../../actions/comments';
import * as AgendaItemActions from '../../actions/agendaItems';
import * as DeliverableActions from '../../actions/deliverables';
import * as selectors from '../../utils/selectors';

import ConversationObjectListApp from './../ConversationObjectListApp';
import AgendaItemInTimeline from '../../components/AgendaItemInTimeline';
import {fillConversationObject, fillAgendaItem} from '../../utils/entityUtils';
import ConversationObjectList from '../../components/ConversationObjectList/index';

import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItemApp extends React.Component {
  constructor() {
    super();

    this.handleBackClick = (e) => {
      e.preventDefault();

      this.props.backToConversation(this.props.currentConversation.id);
    };
  }

  /*
   * This is called when the component is first mounted to the DOM.
   *
   * Here we fetch the conversation Objects for the agendaItemId (from the route) and set the selectedAgendaItemId in
   * the store using the selectAgendaItem ActionCreator. That is the same ActionCreator that is used when you click
   * on an agenda item to select it.
   */
  componentDidMount () {
    this.props.selectAgendaItem(this.props.currentConversation.id, this.props.selectedAgendaItemIdInPath)
  }

  render() {
    const { selectedAgendaItem, updateAgendaItem, closeAgendaItem, conversationObjectsList, currentConversation, currentUser } = this.props;
    if(selectedAgendaItem) {
      return (
          <ConversationObjectListApp {...conversationObjectsList} currentConversation={currentConversation} updateAgendaItem={updateAgendaItem}/>
      );
    }
    else {
      return <div className='text-center'><h5>Loading...</h5></div>;
    }
  }
}

function prepareConversationObjectList(state, objectsToShow, parentObject, canCreateAgendaItem, canCreateDeliverable, createDeliverable) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  var conversationObjectsList = {commentForm: {}};

  if (objectsToShow) {
    conversationObjectsList.conversationObjects = objectsToShow.get('references').map(function(objectReference){
      return fillConversationObject(state, objectReference);
    }).toList().sortBy(function(conversationObject) {
      return conversationObject.createdAt;
    }).toJS();

    if ( parseInt(decodeURIComponent(objectsToShow.get('nextPageUrl')).split("page[size]=")[1]) == 0 )
      conversationObjectsList.nextPageUrl = null;
    else
      conversationObjectsList.nextPageUrl = objectsToShow.get('nextPageUrl');
    conversationObjectsList.isFetching = objectsToShow.get('isFetching');
    conversationObjectsList.commentForm.currentUser = currentUser;
    conversationObjectsList.commentForm.parent = parentObject;
    conversationObjectsList.commentForm.canCreateAgendaItem = canCreateAgendaItem;
    conversationObjectsList.commentForm.canCreateDeliverable = canCreateDeliverable;
    conversationObjectsList.canCreateAgendaItem = canCreateAgendaItem;
    conversationObjectsList.canCreateDeliverable = canCreateDeliverable;
    conversationObjectsList.createDeliverable = createDeliverable;
    conversationObjectsList.users = selectors.conversationMembers(state);
  }

  return conversationObjectsList;
}

function mapStateToProps(state) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
  const selectedAgendaItemIdInState = state.getIn(['selectedConversationObject', 'type']) === 'agendaItems' ? state.getIn(['selectedConversationObject', 'id']) : null;
  const selectedAgendaItemIdInPath = state.get('routing').path.split('/')[4];
  const selectedAgendaItemId = selectedAgendaItemIdInState;

  const selectedAgendaItem = selectedAgendaItemId ? fillAgendaItem(state, selectedAgendaItemId) : null;

  const objectsToShow = state.getIn(['conversationObjectsByAgendaItem', selectedAgendaItemId]);
  const conversationObjectsList = prepareConversationObjectList(state, objectsToShow, selectedAgendaItem, false, true);

  return {
    selectedAgendaItemIdInPath: selectedAgendaItemIdInPath,
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