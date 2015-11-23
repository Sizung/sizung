// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectAgendaItem(this.props.agendaItem.conversationId, this.props.agendaItem.id);
    };
  }

  render() {
    const {agendaItem, selected} = this.props;
    const {conversation} = this.props.agendaItem;

    var style = {};
    var styleName = 'default';
    if(selected === true) {
      //style['backgroundColor'] = '#9C9';
      styleName = 'selected';
    }

    return (
      <div styleName={styleName} onClick={this.handleClick}>
        <div styleName="title-row">
              <div styleName='title'>{ agendaItem.title }</div>
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
    commentsCount: PropTypes.number.isRequired,
    conversation: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  selectAgendaItem: PropTypes.func.isRequired
};

export default AgendaItem;