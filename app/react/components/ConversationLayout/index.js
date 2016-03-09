import React, { Component, PropTypes } from 'react';
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

    this.state = {
      currentPanelInFocus: 'center',
    };

    this.handleLeftPanelLeftSwipe = this.handleLeftPanelLeftSwipe.bind(this);
    this.handleCenterPanelLeftSwipe = this.handleCenterPanelLeftSwipe.bind(this);
    this.handleCenterPanelRightSwipe = this.handleCenterPanelRightSwipe.bind(this);
    this.handleRightPanelRightSwipe = this.handleRightPanelRightSwipe.bind(this);
    this.handleResetPanelVisibility = this.handleResetPanelVisibility.bind(this);
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
    this.setState({ currentPanelInFocus: 'center' });
  }

  handleCenterPanelLeftSwipe() {
    this.setState({ currentPanelInFocus: 'right' });
  }

  handleCenterPanelRightSwipe() {
    this.setState({ currentPanelInFocus: 'left' });
  }

  handleRightPanelRightSwipe() {
    this.setState({ currentPanelInFocus: 'center' });
  }

  handleResetPanelVisibility() {
    this.setState({ currentPanelInFocus: 'center' });
  }

  render() {
    const left = this.props.left || <AgendaItemListApp conversationId={this.props.conversationId} selectedAgendaItemId={this.props.selectedAgendaItemId} />;
    const right = this.props.right || <DeliverableListApp conversationId={this.props.conversationId} agendaItemId={this.props.selectedAgendaItemId} selectedDeliverableId={this.props.selectedDeliverableId} />;

    return (
      <div className={styles.root}>
        <div className={styles.left}>
          { left }
        </div>
        <div className={styles.center}>
          { this.props.children }
        </div>
        <div className={styles.right}>
           { right }
        </div>
      </div>
    );
  }
}

ConversationLayout.propTypes = {
  left: PropTypes.object,
  children: PropTypes.object.isRequired,
  right: PropTypes.object,
};

export default ConversationLayout;
