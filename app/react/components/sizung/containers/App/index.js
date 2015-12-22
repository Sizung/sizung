import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col } from 'react-bootstrap';

import * as CommentsActions from '../../actions/comments';
import * as AgendaItemActions from '../../actions/agendaItems';
import * as DeliverableActions from '../../actions/deliverables';

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
import Swipeable from "react-swipeable";

@CSSModules(styles)
class App extends Component {

  constructor() {

    super();
    this.handleLeftPanelLeftSwipe = this.handleLeftPanelLeftSwipe.bind(this);
    this.handleCenterPanelLeftSwipe = this.handleCenterPanelLeftSwipe.bind(this);
    this.handleCenterPanelRightSwipe = this.handleCenterPanelRightSwipe.bind(this);
    this.handleRightPanelRightSwipe = this.handleRightPanelRightSwipe.bind(this);
    this.handleResetPanelVisibility = this.handleResetPanelVisibility.bind(this);
  }

  handleLeftPanelLeftSwipe() {
    $(this.leftPanelNode).addClass('hidden-xs');
    $(this.centerPanelNode).removeClass('hidden-xs');
    $(this.centerPanelNode).addClass('col-xs-12');
  }

  handleCenterPanelLeftSwipe() {
    $(this.centerPanelNode).addClass('hidden-xs');
    $(this.rightPanelNode).removeClass('hidden-xs');
    $(this.rightPanelNode).addClass('col-xs-12');
  }

  handleCenterPanelRightSwipe() {
    $(this.centerPanelNode).addClass('hidden-xs');
    $(this.leftPanelNode).removeClass('hidden-xs');
    $(this.leftPanelNode).addClass('col-xs-12');
  }

  handleRightPanelRightSwipe() {
    $(this.rightPanelNode).addClass('hidden-xs');
    $(this.centerPanelNode).removeClass('hidden-xs');
    $(this.centerPanelNode).addClass('col-xs-12');
  }

  handleResetPanelVisibility() {
    $(this.centerPanelNode).removeClass('hidden-xs');
    $(this.centerPanelNode).addClass('col-xs-12');
    $(this.rightPanelNode).addClass('hidden-xs');
    $(this.rightPanelNode).removeClass('col-xs-12');
    $(this.leftPanelNode).addClass('hidden-xs');
    $(this.leftPanelNode).removeClass('col-xs-12');
  }

  render() {
    const { currentUser, organizations, currentOrganization, currentConversation} = this.props;

    return (<ApplicationLayout currentUser={currentUser} organizations={organizations} currentOrganization={currentOrganization} currentConversation={currentConversation}>
      <Row styleName='root'>
        <Col className='hidden-xs' sm={3} styleName='left-panel' ref='leftPanel'>
          <Swipeable styleName='swipe-container' onSwipingLeft={this.handleLeftPanelLeftSwipe}>
            <AgendaItemListApp />
          </Swipeable>
        </Col>
        <Col xs={12} sm={6} styleName='center-panel' ref='centerPanel'>
          <Swipeable styleName='swipe-container' onSwipingLeft={this.handleCenterPanelLeftSwipe} onSwipingRight={this.handleCenterPanelRightSwipe}>
            {this.props.children}
          </Swipeable>
        </Col>
        <Col className='hidden-xs' sm={3} styleName='right-panel' ref='rightPanel'>
          <Swipeable styleName='swipe-container' onSwipingRight={this.handleRightPanelRightSwipe}>
            <DeliverableListApp />
          </Swipeable>
        </Col>
      </Row>
    </ApplicationLayout>);
  }

  componentDidMount() {
    this.leftPanelNode = React.findDOMNode(this.refs.leftPanel);
    this.centerPanelNode = React.findDOMNode(this.refs.centerPanel);
    this.rightPanelNode = React.findDOMNode(this.refs.rightPanel);
  }

  componentWillReceiveProps() {
    if (null != this.props.selectedAgendaItemIdInState) {
      this.handleResetPanelVisibility();
    }
    if (null != this.props.selectedDeliverableIdInState) {
      this.handleResetPanelVisibility();
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
  }

  return conversationObjectsList;
}

function mapStateToProps(state) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
  const currentOrganization = state.getIn(['entities', 'organizations', state.getIn(['currentOrganization', 'id'])]);
  const organizations = state.getIn(['entities', 'organizations']).map(function(organization){
    return organization;
  }).toList();

  const selectedAgendaItemIdInState = state.getIn(['selectedConversationObject', 'type']) === 'agendaItems' ? state.getIn(['selectedConversationObject', 'id']) : null;
  const selectedDeliverableIdInState = state.getIn(['selectedConversationObject', 'type']) === 'deliverables' ? state.getIn(['selectedConversationObject', 'id']) : null;

  var conversationObjectsList;

  const objectsToShow = state.getIn(['conversationObjectsByConversation', state.getIn(['currentConversation', 'id'])]);
  conversationObjectsList = prepareConversationObjectList(state, objectsToShow, currentConversation, true, false);

  return {
    organizations: organizations,
    currentOrganization: currentOrganization,
    conversationObjectsList: conversationObjectsList,
    currentConversation: currentConversation,
    currentUser: currentUser,
    selectedAgendaItemIdInState: selectedAgendaItemIdInState,
    selectedDeliverableIdInState: selectedDeliverableIdInState
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);