import React, { PropTypes } from 'react';

import styles from './TimelineHeader.css';
import AgendaItemInTimeline from '../AgendaItemInTimeline/index';
import DeliverableInTimeline from '../DeliverableInTimeline/index';

class TimelineHeader extends React.Component {
  render() {
    const { parent } = this.props;
    const parentType = parent.type;
    const { archiveAgendaItem, visitAgendaItem, updateAgendaItem, visitConversation, archiveDeliverable, updateDeliverable } = this.props;

    if (!parentType) { return <div />; }

    if (parentType === 'agendaItems') {
      const conversationId = parent.conversationId;
      return (
        <div className={styles.agendaItem}>
          <a className={styles.close} onClick={() => { visitConversation(conversationId); }}>
            <span aria-hidden="true">&times;</span>
          </a>
          <AgendaItemInTimeline agendaItem={parent} archiveAgendaItem={archiveAgendaItem} updateAgendaItem={updateAgendaItem} visitAgendaItem={visitAgendaItem} isTimelineHeader />
        </div>
      );
    }

    if (parentType === 'deliverables') {
      const agendaItemId = parent.agendaItemId;
      return (
        <div className={styles.deliverable}>
          <a className={styles.close} onClick={() => { visitAgendaItem(agendaItemId); }}>
            <span aria-hidden="true">&times;</span>
          </a>
          <DeliverableInTimeline deliverable={parent} archiveDeliverable={archiveDeliverable} updateDeliverable={updateDeliverable} isTimelineHeader />
        </div>
      );
    }

    return <div />;
  }
}

TimelineHeader.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default TimelineHeader;