// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleStatusClick = this.handleStatusClick.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectAgendaItem(this.props.agendaItem.conversationId, this.props.agendaItem.id);
    };
  }

  statusElement(persistedStatus) {
    const styleName = 'status-' + persistedStatus;
    return <span><i styleName={styleName} onClick={this.handleStatusClick}/></span>;
  }

  handleStatusClick(e) {
    e.preventDefault();

    const newStatus = this.props.agendaItem.status === 'open' ? 'resolved' : 'open';
    this.props.updateAgendaItem(this.props.agendaItem.id, {status: newStatus});
  }

  render() {
    const {agendaItem, selected} = this.props;
    const {conversation} = this.props.agendaItem;
    const statusElement = this.statusElement(agendaItem.status);

    var style = {};
    var styleName = 'default';
    if(selected === true) {
      //style['backgroundColor'] = '#9C9';
      styleName = 'selected';
    }

    return (
      <div styleName={styleName} onClick={this.handleClick}>
        <div styleName='title-row'>
              <div styleName='title'>{ agendaItem.title } {statusElement} <a styleName="select-link" onClick={this.handleClick} href="#">discuss</a></div>
              <i styleName='agenda-item-icon'></i>
        </div>
        <div>
          <i styleName='comments-icon'></i>{" "}<small>{agendaItem.commentsCount}</small>
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