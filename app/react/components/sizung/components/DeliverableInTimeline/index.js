// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

import Time from 'react-time'
import User from '../User/index'
import EditableUserApp from '../../containers/EditableUserApp';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import EditableDate from '../EditableDate';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableInTimeline extends React.Component {
  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleDueOnUpdate = this.handleDueOnUpdate.bind(this);
    this.handleAssigneeUpdate = this.handleAssigneeUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeleteClick = (e) => {
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

  handleSelect(e) {
    e.preventDefault();
    this.props.selectDeliverable(
      this.props.deliverable.agendaItem.conversationId,
      this.props.deliverable.agendaItem.id,
      this.props.deliverable.id
    );
  }

  render() {
    const { deliverable } = this.props;
    const { owner, assignee } = deliverable;

    var discussOptionStyle = "discuss-link";
    if ( null != this.props.isTimelineHeader ) {
      discussOptionStyle = ( this.props.isTimelineHeader ? "discuss-link-hide" : "discuss-link");
    }
    return  <div styleName='root'>
        <div styleName='user-container'>
          <User user={owner} />
        </div>
        <div styleName="content-container">
          <i styleName='deliverable-icon'></i>
          <div styleName="title">
            <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} />
          </div>
          <div styleName="status-container">
            <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} />
          </div>
          <div styleName="meta-container">
            <div styleName="meta-container-row">
              <div styleName="assignee-container">
                <div styleName='editable-user-container'>
                  <EditableUserApp user={assignee} onUpdate={this.handleAssigneeUpdate} />
                </div>
                <small styleName='user-label'><strong>Assigned To</strong></small>

              </div>
              <div styleName='due-date-container'>
                <small className="text-muted"><strong>Due Date</strong></small>
                <div styleName='editable-due-date-container'>
                  <EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div styleName="time-container">
          <small><Time value={deliverable.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
          <span styleName={discussOptionStyle}><a href="#" className="btn btn-xs btn-default" onClick={this.handleSelect}>discuss</a></span>
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
  isTimelineHeader: PropTypes.boolean
};

export default DeliverableInTimeline;