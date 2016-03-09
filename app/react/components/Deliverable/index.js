// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import User from '../User/index';
import EditableStatus from '../EditableStatus';
import EditableText from '../EditableText';
import EditableDate from '../EditableDate';
import UnseenBadge from '../UnseenBadge';
import AgendaItemIcon from '../AgendaItemIcon';
import Time from 'react-time';
import TextWithMentions from '../TextWithMentions';
import DeliverableIcon from '../DeliverableIcon';
import ResolveIcon from '../ResolveIcon';
import ArchiveIcon from '../ArchiveIcon';

@CSSModules(styles)
class Deliverable extends React.Component {

  handleClick = (e) => {
    e.preventDefault();
    this.props.visitDeliverable(this.props.deliverable.id);
  };

  handleTitleUpdate = (newTitle) => {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  };

  handleStatusUpdate = (e) => {
    const { deliverable } = this.props;
    this.props.updateDeliverable(this.props.deliverable.id, { status: (deliverable.status === 'open' ? 'resolved' : 'open') });
  };


  handleDueOnUpdate = (newDueOn) => {
    if ( newDueOn !== this.props.deliverable.dueOn ) {
      this.props.updateDeliverable(this.props.deliverable.id, {due_on: newDueOn, status: 'open'});
    }
  };

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveDeliverable(this.props.deliverable.id);
  };

  renderResolveAction = () => {
    return (
      <div ref='statusContainer' className={styles.statusContainer} onClick={this.handleStatusUpdate}>
        <span className={styles.iconContainer}>
          <ResolveIcon size={'x-large'}/>
        </span>
        <span>
          {'Mark as Done'}
        </span>
      </div>
    );
  };

  renderArchiveAction = () => {
    return (
      <div className={styles.archiveContainer} onClick={this.handleArchive}>
        <span className={styles.iconContainer}>
          <ArchiveIcon size={'x-large'}/>
        </span>
        <span>
          {'Archive'}
        </span>
      </div>
    );
  };

  renderActions = () => {
    const { deliverable, selected } = this.props;
    if (selected && !deliverable.archived) {
      return (
          <div className={styles.actionContainer}>
            { deliverable.status === 'open' ? this.renderResolveAction() : this.renderArchiveAction()}
          </div>
      );
    }
    return null;
  };

  agendaItemTitle = () => {
    const { conversationContext, selected, deliverable } = this.props;
    return (
        <div className={styles.contextTitleContainer}>
          <AgendaItemIcon size={'small'} inverted={selected} style={{ marginRight: '5px' }}/>
          <TextWithMentions maxLength={40}>{ deliverable.agendaItem.title }</TextWithMentions>
        </div>
    );
  };

  render() {
    const { deliverable, selected } = this.props;
    const { status, title, assignee, dueOn, unseenCount, archived } = deliverable;

    let styleName = styles.seen;
    let deliverableIconStatus = 'default';
    if (selected) {
      styleName = styles.selected;
    } else if (unseenCount > 0) {
      styleName = styles.unseen;
    }

    if (status === 'resolved') {
      deliverableIconStatus = 'completed';
    } else if (dueOn) {
      const dueDateDiffInHrs = Math.floor(((new Date(dueOn)).setHours(0,0,0,0) - (new Date()).setHours(0,0,0,0)) / (1000 * 60 * 60));
      console.log('dueDateDiffInHrs: ' + dueDateDiffInHrs);
      if (dueDateDiffInHrs < 0) {
        deliverableIconStatus = 'overdue';
      } else if (dueDateDiffInHrs >= 0 && dueDateDiffInHrs <= 24) {
        deliverableIconStatus = 'dueToday';
      }
    }
    console.log('deliverableIconStatus: ' + deliverableIconStatus + ", dueOn: " + dueOn);
    return (
      <div className={styleName} onClick={this.handleClick}>
        <div className={styles.contentContainer} title={title}>
          <div className={styles.titleContainer}>
            <div className={styles.deliverableIconContainer}>
              <DeliverableIcon status={deliverableIconStatus} size={'small'}/>
            </div>
            <div className={styles.title}>
              <EditableText text={title} onUpdate={this.handleTitleUpdate} editable={!archived} inverted maxLength={40}/>
            </div>
          </div>
          <div className={deliverableIconStatus === 'overdue' ? styles.dueDateOverdueContainer : styles.dueDateContainer}>
            <EditableDate value={dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} />
          </div>
        </div>
        <div className={styles.bottomRow}>
          <div style={{float: 'right', width: '30px'}}>
            <User user={assignee} />
          </div>
          { selected ? this.renderActions() : this.agendaItemTitle() }
        </div>
      </div>
    );
  }
}

Deliverable.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    agendaItem: PropTypes.object.isRequired,
  }).isRequired,
  visitDeliverable: PropTypes.func.isRequired,
  updateDeliverable: PropTypes.func,
  conversationContext: PropTypes.bool.isRequired,
  archiveDeliverable: PropTypes.func.isRequired,
};

Deliverable.defaultProps = {
  deliverable: {
    title: 'foobar',
    agendaItem: {
      title: 'barfoo',
    },
  },
};

export default Deliverable;
