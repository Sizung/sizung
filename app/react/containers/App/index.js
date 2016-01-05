import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-bootstrap';

import * as AgendaItemActions from '../../actions/agendaItems';
import * as selectors from '../../utils/selectors';

import AgendaItemListApp from './../AgendaItemListApp';
import DeliverableListApp from './../DeliverableListApp';
import { fillConversationObject } from '../../utils/entityUtils';
import ApplicationLayout from '../../components/ApplicationLayout/index';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import Swipeable from 'react-swipeable';

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

  componentDidMount() {
    this.leftPanelNode = React.findDOMNode(this.refs.leftPanel);
    this.centerPanelNode = React.findDOMNode(this.refs.centerPanel);
    this.rightPanelNode = React.findDOMNode(this.refs.rightPanel);
  }

  componentWillReceiveProps() {
    if (this.props.selectedAgendaItemIdInState !== null) {
      this.handleResetPanelVisibility();
    }
    if (this.props.selectedDeliverableIdInState !== null) {
      this.handleResetPanelVisibility();
    }
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
    const { currentUser, organizations, currentOrganization, currentConversation, users } = this.props;

    return (<ApplicationLayout currentUser={currentUser} organizations={organizations} currentOrganization={currentOrganization} currentConversation={currentConversation} users={users}>
      <Row styleName="root">
        <Col className="hidden-xs" sm={3} styleName="left-panel" ref="leftPanel">
          <Swipeable styleName="swipe-container" onSwipingLeft={this.handleLeftPanelLeftSwipe}>
            <AgendaItemListApp />
          </Swipeable>
        </Col>
        <Col xs={12} sm={6} styleName="center-panel" ref="centerPanel">
          <Swipeable styleName="swipe-container" onSwipingLeft={this.handleCenterPanelLeftSwipe} onSwipingRight={this.handleCenterPanelRightSwipe}>
            {this.props.children}
          </Swipeable>
        </Col>
        <Col className="hidden-xs" sm={3} styleName="right-panel" ref="rightPanel">
          <Swipeable styleName="swipe-container" onSwipingRight={this.handleRightPanelRightSwipe}>
            <DeliverableListApp />
          </Swipeable>
        </Col>
      </Row>
    </ApplicationLayout>);
  }
}

function mapStateToProps(state) {
  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
  const currentOrganization = state.getIn(['entities', 'organizations', state.getIn(['currentOrganization', 'id'])]);
  const organizations = state.getIn(['entities', 'organizations']).map((organization) => {
    return organization;
  }).toList();

  const selectedAgendaItemIdInState = state.getIn(['selectedConversationObject', 'type']) === 'agendaItems' ? state.getIn(['selectedConversationObject', 'id']) : null;
  const selectedDeliverableIdInState = state.getIn(['selectedConversationObject', 'type']) === 'deliverables' ? state.getIn(['selectedConversationObject', 'id']) : null;

  const users = selectors.conversationMembers(state);

  return {
    organizations,
    currentOrganization,
    currentConversation,
    currentUser,
    selectedAgendaItemIdInState,
    selectedDeliverableIdInState,
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AgendaItemActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
