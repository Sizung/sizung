import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';

import * as CommentsActions from '../../actions/comments';
import * as AgendaItemActions from '../../actions/agendaItems';
import * as DeliverableActions from '../../actions/deliverables';
import * as selectors from '../../utils/selectors';

import AgendaItemListApp from './../AgendaItemListApp';
import DeliverableListApp from './../DeliverableListApp';
import ConversationObjectListApp from './../ConversationObjectListApp';
import UserListApp from './../UserListApp';
import CommentForm from '../../components/CommentForm/index';
import Comment from '../../components/Comment/index';
import DeliverableInTimeline from '../../components/DeliverableInTimeline';
import AgendaItemInTimeline from '../../components/AgendaItemInTimeline';
import {fillConversationObject, fillAgendaItem} from '../../utils/entityUtils';
import ApplicationLayout from '../../components/ApplicationLayout/index';
import ConversationObjectList from '../../components/ConversationObjectList/index';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
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
      return <ConversationObjectListApp {...conversationObjectsList} currentConversation={currentConversation} styleName='root' />
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
    conversationObjectsList.canCreateAgendaItem = canCreateAgendaItem;
    conversationObjectsList.canCreateDeliverable = canCreateDeliverable;
    conversationObjectsList.users = selectors.conversationMembers(state);
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
    currentUser: currentUser,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationApp);