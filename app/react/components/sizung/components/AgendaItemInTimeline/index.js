// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from '../User/index'
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleTitleUpdate(newTitle) {
    console.log("newTitle " + newTitle);
    this.props.updateAgendaItem(this.props.agendaItem.id, {title: newTitle});
  }

  handleStatusUpdate(newStatus) {
    this.props.updateAgendaItem(this.props.agendaItem.id, {status: newStatus});
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.selectAgendaItem(this.props.agendaItem.conversationId, this.props.agendaItem.id);
  }

  render() {
    const { agendaItem } = this.props;
    const { title, status, owner } = agendaItem;

    return  <div styleName='root'>
      <div styleName='user-container'>
        <User user={owner} />
      </div>
      <div styleName="content-container">
        <div styleName="title-container">
          <EditableText text={title} onUpdate={this.handleTitleUpdate} />
        </div>
        <div styleName="status-container">
          <EditableStatus status={status} onUpdate={this.handleStatusUpdate} />
        </div>
      </div>
      <div styleName="time-container">
        <small><Time value={agendaItem.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
        <span styleName="discuss-link"><a href="#" onClick={this.handleSelect}>discuss</a></span>
      </div>
    </div>;
  }
}

AgendaItemInTimeline.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  updateAgendaItem: PropTypes.func.isRequired
};

export default AgendaItemInTimeline;