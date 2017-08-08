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

  componentDidMount() {
    switch (this.props.currentTimeline) {
      case 'organization':
        this.props.createTimeTrack({ chat_id: this.props.organization.id, chat_type: 'Organization' });
        break;
      case 'conversation':
        this.props.createTimeTrack({ chat_id: this.props.conversationId, chat_type: 'Conversation' });
        break;
      case 'agendaItem':
        this.props.createTimeTrack({ chat_id: this.props.selectedAgendaItemId, chat_type: 'AgendaItem' });
        break;
      case 'deliverable':
        this.props.createTimeTrack({ chat_id: this.props.selectedDeliverableId, chat_type: 'Deliverable' });
        break;
      default:
        break;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    switch (this.props.currentTimeline) {
      case 'organization':
        if (this.props.organization.id != prevProps.organization.id) {
          this.props.createTimeTrack({chat_id: this.props.organization.id, chat_type: 'Organization'});
        }
        break;
      case 'conversation':
        if (this.props.conversationId != prevProps.conversationId) {
          this.props.createTimeTrack({chat_id: this.props.conversationId, chat_type: 'Conversation'});
        }
        break;
      case 'agendaItem':
        if (this.props.selectedAgendaItemId != prevProps.selectedAgendaItemId) {
          this.props.createTimeTrack({chat_id: this.props.selectedAgendaItemId, chat_type: 'AgendaItem'});
        }
        break;
      case 'deliverable':
        if (this.props.selectedDeliverableId != prevProps.selectedDeliverableId) {
          this.props.createTimeTrack({chat_id: this.props.selectedDeliverableId, chat_type: 'Deliverable'});
        }
        break;
      default:
        break;
    }
  }

  render() {
    const left = this.props.left || <AgendaItemListApp currentTimeline={this.props.currentTimeline} conversationId={this.props.conversationId} selectedAgendaItemId={this.props.selectedAgendaItemId} selectedDeliverableId={this.props.selectedDeliverableId} labels={this.props.labels} />;
    const right = this.props.right || <DeliverableListApp currentTimeline={this.props.currentTimeline} conversationId={this.props.conversationId} agendaItemId={this.props.selectedAgendaItemId} selectedDeliverableId={this.props.selectedDeliverableId} labels={this.props.labels}/>;
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
          <BottomNavigationBar onChange={this.setCurrentPanel} selectedOption={this.state.panel} conversation={this.props.conversation}/>
        </div>
      </div>
    );
  }
}

ConversationLayout.propTypes = {
  left: PropTypes.object,
  children: PropTypes.object.isRequired,
  right: PropTypes.object,
  currentTimeline: PropTypes.string.isRequired,
  labels: PropTypes.object.isRequired,
  createTimeTrack: PropTypes.func.isRequired,
};

export default ConversationLayout;
