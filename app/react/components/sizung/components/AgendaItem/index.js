// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';

@CSSModules(styles)
class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleTitleUpdate  = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate  = this.handleStatusUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectAgendaItem(this.props.agendaItem.conversationId, this.props.agendaItem.id);
    };
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, {title: newTitle});
  }

  handleStatusUpdate(newStatus) {
    this.props.updateAgendaItem(this.props.agendaItem.id, {status: newStatus});
  }

  render() {
    const {agendaItem, selected} = this.props;

    var styleName = 'default';
    if(selected === true) {
      styleName = 'selected';
    }

    return (
      <div styleName='root'>
        <div styleName={styleName} onClick={this.handleClick}>
          <div styleName="row">
            <div styleName='content-container'>
              <EditableText text={agendaItem.title} onUpdate={this.handleTitleUpdate} />
            </div>
            <div styleName='status-container'>
              <EditableStatus status={agendaItem.status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
          <div>
            <i styleName='comments-icon'></i>{" "}<small>{agendaItem.commentsCount}</small>
          </div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    conversationId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    conversation: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  selectAgendaItem: PropTypes.func.isRequired,
  updateAgendaItem: PropTypes.func.isRequired
};

export default AgendaItem;