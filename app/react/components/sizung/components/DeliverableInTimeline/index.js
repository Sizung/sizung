// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

import Time from 'react-time'
import User from '../User'
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableInTimeline extends React.Component {
  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
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

  render() {
    const { deliverable } = this.props;
    return  (
      <div styleName="root">
        <div styleName="content-container">
          <div styleName="title">
            <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} />
          </div>
          <div styleName="status-container">
            <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} />
          </div>
        </div>
        <div styleName="time-container">
          <small><Time value={deliverable.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
        </div>
      </div>
    );
  }
}

DeliverableInTimeline.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    agendaItem: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateDeliverable: PropTypes.func.isRequired
};

export default DeliverableInTimeline;