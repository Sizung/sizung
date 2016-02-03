import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Row, Col } from 'react-bootstrap';

import AgendaItemListApp from '../../containers/AgendaItemListApp';
import DeliverableListApp from '../../containers/DeliverableListApp';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import Swipeable from 'react-swipeable';

@CSSModules(styles)
class ConversationLayout extends Component {

  constructor() {
    super();
    this.handleLeftPanelLeftSwipe = this.handleLeftPanelLeftSwipe.bind(this);
    this.handleCenterPanelLeftSwipe = this.handleCenterPanelLeftSwipe.bind(this);
    this.handleCenterPanelRightSwipe = this.handleCenterPanelRightSwipe.bind(this);
    this.handleRightPanelRightSwipe = this.handleRightPanelRightSwipe.bind(this);
    this.handleResetPanelVisibility = this.handleResetPanelVisibility.bind(this);
  }

  componentDidMount() {
    this.leftPanelNode = ReactDOM.findDOMNode(this.refs.leftPanel);
    this.centerPanelNode = ReactDOM.findDOMNode(this.refs.centerPanel);
    this.rightPanelNode = ReactDOM.findDOMNode(this.refs.rightPanel);
  }

  componentWillReceiveProps() {
    if (this.props.selectedAgendaItemIdInState !== null) {
      this.handleResetPanelVisibility();
    }
    if (this.props.selectedDeliverableIdInState !== null) {
      this.handleResetPanelVisibility();
    }
  }

  // TODO: That really has to be done the react way. It will definitely cause problems to change the dom that way.
  // The better way is to save the state in which the view currently is in the component state, render accordingly to
  // that state and change the state when the user swipes.
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
    const left = this.props.left || <AgendaItemListApp conversationId={this.props.conversationId} selectedAgendaItemId={this.props.selectedAgendaItemId} />;
    const right = this.props.right || <DeliverableListApp conversationId={this.props.conversationId} selectedDeliverableId={this.props.selectedDeliverableId} />;

    return (
      <Row styleName="root">
        <Col className="hidden-xs" sm={3} styleName="left-panel" ref="leftPanel">
          <Swipeable styleName="swipe-container" onSwipingLeft={this.handleLeftPanelLeftSwipe}>
            { left }
          </Swipeable>
        </Col>
        <Col xs={12} sm={6} styleName="center-panel" ref="centerPanel">
          <Swipeable styleName="swipe-container" onSwipingLeft={this.handleCenterPanelLeftSwipe} onSwipingRight={this.handleCenterPanelRightSwipe}>
            { this.props.children }
          </Swipeable>
        </Col>
        <Col className="hidden-xs" sm={3} styleName="right-panel" ref="rightPanel">
          <Swipeable styleName="swipe-container" onSwipingRight={this.handleRightPanelRightSwipe}>
            { right }
          </Swipeable>
        </Col>
      </Row>
    );
  }
}

ConversationLayout.propTypes = {
  left: PropTypes.object,
  children: PropTypes.object.isRequired,
  right: PropTypes.object,
};

export default ConversationLayout;
