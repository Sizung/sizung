// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

import Time from 'react-time'
import User from '../User/index'
import EditableUserApp from '../../containers/EditableUserApp';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import EditableDate from '../EditableDate';
import EditableAgendaItem from '../EditableAgendaItem';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableInTimeline extends React.Component {
  constructor() {
    super();

    this.renderActionButtons    = this.renderActionButtons.bind(this);
    this.handleArchive          = this.handleArchive.bind(this);
    this.handleTitleUpdate      = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate     = this.handleStatusUpdate.bind(this);
    this.handleDueOnUpdate      = this.handleDueOnUpdate.bind(this);
    this.handleAssigneeUpdate   = this.handleAssigneeUpdate.bind(this);
    this.handleAgendaItemUpdate = this.handleAgendaItemUpdate.bind(this);
    this.handleSelect           = this.handleSelect.bind(this);
    this.handleDeleteClick      = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    }
  }

  handleTitleUpdate(newTitle) {
    this.props.updateDeliverable(this.props.deliverable.id, {title: newTitle});
  }

  handleStatusUpdate(newStatus) {
    this.props.updateDeliverable(this.props.deliverable.id, {status: newStatus});
  }

  handleDueOnUpdate(newDueOn) {
    this.props.updateDeliverable(this.props.deliverable.id, {due_on: newDueOn});
  }

  handleAssigneeUpdate(newAssigneeId) {
    this.props.updateDeliverable(this.props.deliverable.id, {assignee_id: newAssigneeId});
  }

  handleAgendaItemUpdate(newAgendaItemId) {
    this.props.updateDeliverable(this.props.deliverable.id, {agenda_item_id: newAgendaItemId});
  }

  handleArchive(e) {
    e.preventDefault();
    this.props.archiveDeliverable(this.props.deliverable.id);
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
    var discussOptionStyle = "discuss-link";
    if ( null != this.props.isTimelineHeader ) {
      discussOptionStyle = ( this.props.isTimelineHeader ? "discuss-link-hide" : "discuss-link");
    }

    return (
      <span>
        <span styleName='discuss-link'><a href="#" className='btn btn-xs btn-default' onClick={this.handleArchive}>archive</a></span>
        <span styleName={discussOptionStyle}><a href="#" className='btn btn-xs btn-default' onClick={this.handleSelect}>discuss</a></span>
      </span>
    )
  }

  render() {
    const { deliverable } = this.props;
    const { owner, assignee, agendaItem, archived } = deliverable;

    return  <div styleName='root'>
        <div styleName='user-container'>
          <User user={owner} />
        </div>
        <div styleName="content-container">
          <div styleName="row">
            <div styleName="full-width">
              <div styleName="title-container">
                <img style={{ marginRight: '5px', marginTop: '3px', float: 'left', clear: 'right'}} height='15px' src={window.location.protocol + "//" + window.location.host + "/icons/deliverable-icon-gray.png"}></img>
                <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} editable={!archived} />
              </div>
              <div styleName="status-container">
                <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} editable={!archived} />
              </div>
            </div>
          </div>
          <div styleName="meta-container">
            <div styleName="meta-content">
              <div styleName="meta-label">Assigned To</div>
              <div><EditableUserApp user={assignee} onUpdate={this.handleAssigneeUpdate} editable={!archived} /></div>
            </div>
            <div styleName="meta-content">
              <div styleName="meta-label">Due Date</div>
              <div><EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} /></div>
            </div>
            <div styleName="meta-content">
              <div styleName="meta-label">Agenda Item</div>
              <div><EditableAgendaItem agendaItem={agendaItem} onUpdate={this.handleAgendaItemUpdate} editable={!archived} /></div>
            </div>
          </div>
        </div>
        <div styleName="time-container">
          <small>
            <Time value={deliverable.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative />
            { archived ? ' (archived)' : '' }
          </small>
          { archived ? '' : this.renderActionButtons() }
        </div>
      </div>
  }
}

DeliverableInTimeline.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dueOn: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    agendaItem: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateDeliverable: PropTypes.func.isRequired,
  isTimelineHeader: PropTypes.bool
};

export default DeliverableInTimeline;