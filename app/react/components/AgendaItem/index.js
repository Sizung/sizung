// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import styles from './index.css';

import EditableStatus from '../EditableStatus';
import EditableText from '../EditableText';
import UnseenBadge from '../UnseenBadge';
import DeliverablesCounter from '../DeliverablesCounter';
import ConversationIcon from '../ConversationIcon';
import User from '../User';
import TextWithMentions from '../TextWithMentions';
import AgendaItemIcon from '../AgendaItemIcon';

class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.visitAgendaItem(this.props.agendaItem.id);
    };
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: newStatus });
  }

  render() {
    const { agendaItem, selected } = this.props;
    let styleName = styles.seen;
    if (selected) {
      styleName = styles.selected;
    } else if (agendaItem.unseenCount > 0) {
      styleName = styles.unseen;
    }
    return (
      <div className={styleName} onClick={this.handleClick}>
        <div className={styles.leftColumn}>
          <div className={styles.row}>
            <div className={styles.contentContainer} title={agendaItem.title}>
              <div className={styles.agendaItemIconContainer}>
                <AgendaItemIcon inverted={true}/>
              </div>
              <div className={styles.titleContainer}>
                <EditableText text={agendaItem.title} onUpdate={this.handleTitleUpdate} editable={!agendaItem.archived} inverted={true}/>
              </div>
            </div>
            <div className={styles.statusContainer}>
              <EditableStatus editable={false} status={agendaItem.status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    conversation: PropTypes.object,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    deliverablesCount: PropTypes.number.isRequired,
  }).isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
  organizationContext: PropTypes.bool.isRequired,
};

export default AgendaItem;
