import React, { PropTypes } from 'react';
import styles from './index.css';
import EditableText from '../EditableText';
import EditableDate from '../EditableDate';
import EditableUserApp from '../../containers/EditableUserApp';
import Icon from '../Icon';
import TextWithMentions from '../TextWithMentions';
import DeliverableIcon from '../DeliverableIcon';
import ResolveIcon from '../ResolveIcon';
import ArchiveIcon from '../ArchiveIcon';
import * as deliverableUtils from '../../utils/deliverableUtils.js';

class Deliverable extends React.Component {

  handleClick = (e) => {
    e.preventDefault();
    this.props.visitDeliverable(this.props.deliverable.id);
  };

  handleTitleUpdate = (newTitle) => {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  };

  handleStatusUpdate = (e) => {
    e.preventDefault();
    this.props.updateDeliverable(this.props.deliverable.id, { status: (this.props.deliverable.status === 'open' ? 'resolved' : 'open') });
  };


  handleDueOnUpdate = (newDueOn) => {
    if (newDueOn !== this.props.deliverable.dueOn) {
      this.props.updateDeliverable(this.props.deliverable.id, { due_on: newDueOn, status: 'open' });
    }
  };

  handleAssigneeUpdate = (assigneeId) => {
    if (assigneeId !== this.props.deliverable.assigneeId) {
      this.props.updateDeliverable(this.props.deliverable.id, { assignee_id: assigneeId });
    }
  };

  handleArchive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.archiveDeliverable(this.props.deliverable.id);
  };

  parentContextTitle = () => {
    const { deliverable, currentTimeline } = this.props;
    let icon;
    let contextTitle = deliverable.parent.title;

    if (deliverable.parentType === 'agendaItems') {
      if (currentTimeline === 'organization') {
        icon = <Icon type="chat" gap="15px" />;
        contextTitle = deliverable.parent.conversation.title;
      } else {
        icon = <Icon type="agendaItem"/>;
      }
    } else if (deliverable.parentType === 'conversations') {
      icon = <Icon type="chat" gap="15px" />;
    }
    return (
      <div className={styles.contextTitleContainer}>
        { icon }
        { contextTitle }
      </div>
    );
  };

  dueDateStatus = () => {
    const { status, dueOn } = this.props.deliverable;
    if (status === 'resolved') {
      return 'completed';
    } else if (dueOn) {
      const dueDateDiffInHrs = Math.floor(((new Date(dueOn)).setHours(0,0,0,0) - (new Date()).setHours(0, 0, 0, 0)) / (1000 * 60 * 60));
      if (dueDateDiffInHrs < 0) {
        return 'overdue';
      } else if (dueDateDiffInHrs >= 0 && dueDateDiffInHrs <= 24) {
        return 'dueToday';
      }
    }
  };

  renderResolveAction = () => {
    return (
      <div className={styles.resolveActionContainer} onClick={this.handleStatusUpdate}>
        <div className={styles.actionIconContainer}>
          <ResolveIcon/>
        </div>
        {'Mark as Done'}
      </div>
    );
  };

  renderArchiveAction = () => {
    return (
      <div className={styles.archiveActionContainer}  onClick={this.handleArchive}>
        <div className={styles.actionIconContainer}>
          <ArchiveIcon/>
        </div>
      </div>
    );
  };

  renderActions = () => {
    const { deliverable, selected } = this.props;
    if (selected && !deliverable.archived) {
      return (
          <div className={styles.actionContainer}>
            {(deliverable.status === 'open' ? this.renderResolveAction() : false)}
            {this.renderArchiveAction()}
          </div>
      );
    }
    return null;
  };

  isElementOutViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
  };

  componentDidUpdate() {
    if (this.props.selected && this.isElementOutViewport(this.refs.deliverable)) {
      this.refs.deliverable.scrollIntoView();
    }
  }

  handleKeyDown(event) {
    event.stopPropagation();
  }

  render() {
    const { deliverable, selected } = this.props;
    const { title, assigneeId, dueOn, unseenCount, archived } = deliverable;
    const deliverableIconStatus = this.dueDateStatus();
    let styleName = styles.seen;

    if (selected) {
      styleName = styles.selected;
    } else if (unseenCount > 0) {
      styleName = styles.unseen;
    }

    return (
      <div ref='deliverable' className={styleName} onClick={this.handleClick}>
        <div className={styles.titleContainer} title={title}>
          <div className={styles.deliverableIconContainer}>
            <DeliverableIcon status={deliverableIconStatus} size={'small'} />
          </div>
          <div className={styles.title}>
            <EditableText text={title} onUpdate={this.handleTitleUpdate} editable={selected} inverted maxLength={40} />
          </div>
        </div>
        <div className={deliverableIconStatus === 'overdue' ? styles.dueDateOverdueContainer : styles.dueDateContainer}
         onKeyDown={this.handleKeyDown}
        >
          <EditableDate value={dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} />
        </div>
        <div className={styles.bottomRow}>
          { selected ? this.renderActions() : this.parentContextTitle() }
          <div className={styles.assignee}>
            <EditableUserApp conversationId={deliverableUtils.getConversationIdFromParent(deliverable.parent)} editable userId={assigneeId} onUpdate={this.handleAssigneeUpdate} />
          </div>
        </div>
      </div>
    );
  }
}

Deliverable.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    parent: PropTypes.object.isRequired,
  }).isRequired,
  visitDeliverable: PropTypes.func.isRequired,
  updateDeliverable: PropTypes.func,
  archiveDeliverable: PropTypes.func,
  currentTimeline: PropTypes.string,
};

export default Deliverable;
