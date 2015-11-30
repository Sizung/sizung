// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

import Time from 'react-time'
import User from '../User'
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
    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    }
    this.state = {
      hover: false
    };
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

  toggleHover() {
    this.setState({hover: !this.state.hover});
  }

  render() {
    const { deliverable } = this.props;
    const { owner } = deliverable;
    var hoverStyle = (this.state.hover ? 'on-mouse-over' : 'on-mouse-out');

    return  <div styleName={'root-' + hoverStyle} onMouseOver={this.toggleHover.bind(this)} onMouseOut={this.toggleHover.bind(this)}>
        <div styleName='user-container'>
          <User user={owner} />
        </div>
        <div styleName="content-container">
          <div styleName="title">
            <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} />
          </div>
          <div styleName="status-container">
            <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} />
          </div>
          <div styleName="meta-container">
            <EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} />
          </div>
        </div>
        <div styleName="time-container">
          <small><Time value={deliverable.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
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
  updateDeliverable: PropTypes.func.isRequired
};

export default DeliverableInTimeline;