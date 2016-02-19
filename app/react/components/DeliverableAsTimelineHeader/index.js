// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';

import Time from 'react-time';
import User from '../User/index';
import EditableUserApp from '../../containers/EditableUserApp';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import EditableDate from '../EditableDate';
import EditableAgendaItem from '../EditableAgendaItem';
import DeliverableIcon from '../DeliverableIcon';
import AgendaItemIcon from '../AgendaItemIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class DeliverableAsTimelineHeader extends React.Component {
  constructor() {
    super();
  }

  handleTitleUpdate = (newTitle) => {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  };

  handleStatusUpdate = (newStatus) => {
    this.props.updateDeliverable(this.props.deliverable.id, { status: newStatus });
  };

  handleDueOnUpdate = (newDueOn) => {
    this.props.updateDeliverable(this.props.deliverable.id, { due_on: newDueOn });
  };

  handleAssigneeUpdate = (newAssigneeId) => {
    this.props.updateDeliverable(this.props.deliverable.id, { assignee_id: newAssigneeId });
  };

  handleAgendaItemUpdate = (newAgendaItemId) => {
    this.props.updateDeliverable(this.props.deliverable.id, { agenda_item_id: newAgendaItemId });
  };

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveDeliverable(this.props.deliverable.id);
  };

  handleSelect = (e) => {
    e.preventDefault();
    this.props.visitDeliverable(this.props.deliverable.id);
  };

  lastUpdatedTime = () => {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.deliverable;
    if (archived) {
      return (<span><span>Archived&nbsp;</span><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  };

  renderActions = () => {
    return (!this.props.deliverable.archived ? <span><span className={styles.discussLink}><a href="#" className={styles.actionBtn} onClick={this.handleArchive}>archive</a></span></span> : null);
  };

  render() {
    const { deliverable, showOwner } = this.props;
    const { owner, assignee, agendaItem, archived } = deliverable;
    const { conversationId } = agendaItem;
    return (
      <div className={ archived ? styles.rootArchived : styles.root }>
        <div className={styles.userContainer}>
          <DeliverableIcon inverted={true} size={'small'}/>
          { showOwner ? <User style={{ marginTop: '5px' }} user={owner}/> : '' }
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.row}>
            <div className={styles.fullWidth}>
              <div className={styles.titleContainer}>
                <div className={styles.title}>
                  <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} editable={!archived} inverted={true}/>
                </div>
                <div className={styles.assignee}>
                    <span className='pull-right'><EditableUserApp user={assignee} onUpdate={this.handleAssigneeUpdate} editable={!archived} size={'small'} conversationId={conversationId}/></span>
                    <span className={styles.metaLabel} className={'meta-label'} style={{ padding: '5px', float: 'right' }}>{'ASSIGNED TO'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.metaContainer}>
            <div className={styles.metaContent}>
              <span className={styles.dueOnLabel}>{'DUE DATE: '}</span>
              <span className={styles.dueOn}><EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} /></span>
            </div>
            <div className={styles.metaContent}>
              <AgendaItemIcon size={'small'} style={{marginRight: '5px'}} inverted={true}/>
              <span><EditableAgendaItem agendaItem={agendaItem} onUpdate={this.handleAgendaItemUpdate} editable={!archived} inverted={true}/></span>
            </div>
          </div>
          <div className={styles.timeContainer}>
            <div className={styles.statusContainer}>
              <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} editable={!archived} />
            </div>
            <small>
              {this.lastUpdatedTime()}
            </small>
            { this.renderActions() }
          </div>
        </div>
      </div>
    );
  }
}

DeliverableAsTimelineHeader.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dueOn: PropTypes.string,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    agendaItem: PropTypes.shape({
      title: PropTypes.string.isRequired,
      conversationId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateDeliverable: PropTypes.func.isRequired,
  isTimelineHeader: PropTypes.bool,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

DeliverableAsTimelineHeader.defaultProps = {
  showOwner: true,
};

export default DeliverableAsTimelineHeader;
