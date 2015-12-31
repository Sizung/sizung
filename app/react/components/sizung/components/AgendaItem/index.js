// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import User from '../User/index';
import styles from "./index.css";

import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';

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

  renderUnseenBadge(count, selected) {
    if(!selected) {
      return <UnseenBadge count={count} />
    }
  }

  render() {
    const {agendaItem, selected} = this.props;

    var styleName = 'default';
    if(selected === true) {
      styleName = 'selected';
    }

    return (
      <div styleName='root'>
        {this.renderUnseenBadge(agendaItem.unseenCount, selected)}
        <div styleName={styleName} onClick={this.handleClick}>
          <div styleName="row">
            <div styleName='content-container'>
              <EditableText editable={false} text={agendaItem.title} onUpdate={this.handleTitleUpdate} />
            </div>
            <div styleName='status-container'>
              <EditableStatus editable={false} status={agendaItem.status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
          <div styleName='bottom-row'>
              <span style={{ marginRight: '10px'}} >
                <img height='15px' src={window.location.protocol + "//" + window.location.host + "/icons/chat-icon-gray.png"}></img>
                {" "}<small>{agendaItem.commentsCount}</small>
              </span>
              <span>
                <img height='15px' src={window.location.protocol + "//" + window.location.host + "/icons/deliverable-icon-gray.png"}></img>
                {" "}<small>{agendaItem.deliverablesCount}</small>
              </span>
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
    deliverablesCount: PropTypes.number.isRequired,
    conversation: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  selectAgendaItem: PropTypes.func.isRequired,
  updateAgendaItem: PropTypes.func.isRequired
};

export default AgendaItem;