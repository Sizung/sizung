import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col } from 'react-bootstrap';

import AgendaItemListApp from '../../containers/AgendaItemListApp';
import DeliverableListApp from '../../containers/DeliverableListApp';
import styles from './index.css';
import BottomNavigationBar from '../BottomNavigationBar';

class ConversationLayout extends Component {

  constructor() {
    super();

    this.state = {
      panel: 'conversations',
    };
  }
  
  setCurrentPanel = (panel) => {
    this.setState({ panel })
  };
  
  render() {
    const left = this.props.left || <AgendaItemListApp conversationId={this.props.conversationId} selectedAgendaItemId={this.props.selectedAgendaItemId} />;
    const right = this.props.right || <DeliverableListApp conversationId={this.props.conversationId} agendaItemId={this.props.selectedAgendaItemId} selectedDeliverableId={this.props.selectedDeliverableId} />;
    const { panel } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.panelContainer}>
          <div className={ [styles.left, (panel === 'agendaItems' ? {} : styles.hidden)].join(' ') }>
            { left }
          </div>
          <div className={ [styles.center, (panel === 'conversations' ? {} : styles.hidden)].join(' ') }>
            { this.props.children }
          </div>
          <div className={ [styles.right, (panel === 'deliverables' ? {} : styles.hidden)].join(' ') }>
             { right }
          </div>
        </div>
        <div className={styles.bottomNavigationContainer}>
          <BottomNavigationBar onChange={this.setCurrentPanel} selectedOption={this.state.panel}/>
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
