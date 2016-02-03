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
class DeliverableInTimeline extends React.Component {
  constructor() {
    super();

    this.renderActionButtons = this.renderActionButtons.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleDueOnUpdate = this.handleDueOnUpdate.bind(this);
    this.handleAssigneeUpdate = this.handleAssigneeUpdate.bind(this);
    this.handleAgendaItemUpdate = this.handleAgendaItemUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    };
    this.lastUpdatedTime = this.lastUpdatedTime.bind(this);
  }

  handleTitleUpdate(newTitle) {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateDeliverable(this.props.deliverable.id, { status: newStatus });
  }

  handleDueOnUpdate(newDueOn) {
    this.props.updateDeliverable(this.props.deliverable.id, { due_on: newDueOn });
  }

  handleAssigneeUpdate(newAssigneeId) {
    this.props.updateDeliverable(this.props.deliverable.id, { assignee_id: newAssigneeId });
  }

  handleAgendaItemUpdate(newAgendaItemId) {
    this.props.updateDeliverable(this.props.deliverable.id, { agenda_item_id: newAgendaItemId });
  }

  handleArchive(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to archive this Deliverable?")) {
      this.props.archiveDeliverable(this.props.deliverable.id);
    }
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.selectDeliverable(
      this.props.deliverable.agendaItem.conversationId,
      this.props.deliverable.agendaItem.id,
      this.props.deliverable.id
    );
  }

  renderActionButtons() {
    let discussOptionStyle = 'discuss-link';
    if (this.props.isTimelineHeader !== null) {
      discussOptionStyle = (this.props.isTimelineHeader ? 'discuss-link-hide' : 'discuss-link');
    }

    return (
      <span>
        <span styleName='discuss-link'><a href="#" styleName='action-btn' onClick={this.handleArchive}>archive</a></span>
        <span styleName={discussOptionStyle}><a href="#" styleName='action-btn' onClick={this.handleSelect}>discuss</a></span>
      </span>
    );
  }

  lastUpdatedTime() {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.deliverable;
    if (archived) {
      return (<span><strong>(ARCHIVED)&nbsp;</strong><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  }

  render() {
    const { deliverable, showOwner } = this.props;
    const { owner, assignee, agendaItem, archived } = deliverable;
    const { conversationId } = agendaItem;
    const archiveStyle = (archived ? 'archive-wrapper' : '');

    return (
      <div styleName='root'>
        <div styleName='user-container'>
          <DeliverableIcon inverted={this.props.isTimelineHeader} size={'small'}/>
          { showOwner ? <User style={{ marginTop: '5px' }} user={owner}/> : '' }
        </div>
        <div styleName={'content-container' + (this.props.isTimelineHeader ? '-inverted' : '')}>
          <div styleName='row'>
            <div styleName='full-width'>
              <div styleName={'title-container' + (this.props.isTimelineHeader ? '-inverted' : '')}>
                <div styleName='title'>
                  <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} editable={!archived} inverted={this.props.isTimelineHeader}/>
                </div>
                <div styleName='assignee'>
                    <span className='pull-right'><EditableUserApp user={assignee} onUpdate={this.handleAssigneeUpdate} editable={!archived} size={'small'} conversationId={conversationId}/></span>
                    <span className='pull-right' styleName={'meta-label' + (this.props.isTimelineHeader ? '-inverted' : '')} style={{ padding: '5px' }}>{'ASSIGNED TO'}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName='meta-container'>
            <div styleName='meta-content'>
              <span styleName={'due-on-label' + (this.props.isTimelineHeader ? '-inverted' : '')}>{'DUE DATE: '}</span>
              <span styleName='due-on'><EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} /></span>
            </div>
            <div styleName='meta-content'>
              <AgendaItemIcon size={'small'} style={{marginRight: '5px'}} inverted={this.props.isTimelineHeader}/>
              <span><EditableAgendaItem agendaItem={agendaItem} onUpdate={this.handleAgendaItemUpdate} editable={!archived} inverted={this.props.isTimelineHeader}/></span>
            </div>
          </div>
          <div styleName='time-container'>
            <div styleName='status-container'>
              <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} editable={!archived} />
            </div>
            <small>
              {this.lastUpdatedTime()}
            </small>
            { archived ? '' : this.renderActionButtons() }
          </div>
        </div>
        { archived ? <div styleName={archiveStyle}></div> : '' }
      </div>
    );
  }
}

DeliverableInTimeline.propTypes = {
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
};

DeliverableInTimeline.defaultProps = {
  showOwner: true,
};

export default DeliverableInTimeline;
