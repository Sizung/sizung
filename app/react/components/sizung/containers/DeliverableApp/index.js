import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';

import * as CommentsActions from '../../actions/comments';
import * as AgendaItemActions from '../../actions/agendaItems';
import * as DeliverableActions from '../../actions/deliverables';

import DeliverableInTimeline from '../../components/DeliverableInTimeline';
import ConversationObjectListApp from './../ConversationObjectListApp';
import {fillConversationObject, fillDeliverable} from '../../utils/entityUtils';
import ConversationObjectList from '../../components/ConversationObjectList/index';
import { getPath, getAgendaItemIdFromPath, getDeliverableIdFromPath } from '../../utils/pathUtils';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableApp extends React.Component {
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
   * Here we fetch the conversation Objects for the agendaItemId and deliverableId (from the route) and set the selectedDeliverableId in
   * the store using the selectDeliverable ActionCreator. That is the same ActionCreator that is used when you click
   * on an deliverable to select it.
   */
  componentDidMount () {
    this.props.selectDeliverable(this.props.currentConversation.id, this.props.selectedAgendaItemId, this.props.selectedDeliverableId)
  }

  render() {
    const { selectedDeliverable, closeAgendaItem, conversationObjectsList, currentConversation, currentUser, updateDeliverable } = this.props;
    if(selectedDeliverable && conversationObjectsList) {
      return (<div styleName='root'>
        <div styleName='header'>
          <Button href="#" onClick={this.handleBackClick}>Close</Button>
          <DeliverableInTimeline deliverable={selectedDeliverable} updateDeliverable={updateDeliverable}/>
        </div>
        <div styleName='list'>
          <ConversationObjectListApp {...conversationObjectsList} currentConversation={currentConversation}/>
        </div>
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
  const selectedAgendaItemId = getAgendaItemIdFromPath(getPath(state));
  const selectedDeliverableId = getDeliverableIdFromPath(getPath(state));

  const selectedDeliverable = fillDeliverable(state, selectedDeliverableId);

  const objectsToShow = state.getIn(['conversationObjectsByDeliverable', selectedDeliverableId]);
  const conversationObjectsList = prepareConversationObjectList(state, objectsToShow, selectedDeliverable, false, false);

  return {
    selectedAgendaItemId: selectedAgendaItemId,
    selectedDeliverableId: selectedDeliverableId,
    conversationObjectsList: conversationObjectsList,
    selectedDeliverable: selectedDeliverable,
    currentConversation: currentConversation,
    currentUser: currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...DeliverableActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverableApp);