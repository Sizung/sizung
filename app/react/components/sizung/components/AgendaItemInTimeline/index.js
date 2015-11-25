// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from '../User'
import EditableText from '../EditableText';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

function SelectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

@CSSModules(styles)
class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusClick = this.handleStatusClick.bind(this);
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, {title: newTitle});
  }

  handleStatusClick(e) {
    e.preventDefault();

    const newStatus = this.props.agendaItem.status === 'open' ? 'resolved' : 'open';
    this.props.updateAgendaItem(this.props.agendaItem.id, {status: newStatus});
  }

  statusElement(persistedStatus) {
    const styleName = 'status-' + persistedStatus;
    return <span><i styleName={styleName} onClick={this.handleStatusClick}/></span>;
  }

  render() {
    const { agendaItem } = this.props;
    const { title, status } = agendaItem;
    const statusElement = this.statusElement(status);

    return  <div styleName="root">
              <div styleName="user-container">
              </div>
              <div styleName="content-container">
                <div styleName="title">
                  <EditableText text={title} onUpdate={this.handleTitleUpdate} />
                  {statusElement}
                </div>
                <i styleName="agenda-item-icon" />
                <div styleName="time-container">
                  <small><Time value={agendaItem.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
                </div>
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