// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';

class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectAgendaItem(this.props.agendaItem.id);
    };
  }

  render() {
    const {agendaItem, selected} = this.props;
    const {conversation} = this.props.agendaItem;

    var style = {};
    if(selected === true) {
      style['backgroundColor'] = '#9C9';
    }

    return (
      <div style={style} className="row white-bg padding-sm-vertical margin-xs-vertical box-shadow" onClick={this.handleClick}>
        <div className="col-xs-12">
          <span className="col-xs-11 zero-padding" style={{textAlign: 'left'}}>{ agendaItem.title }</span>
          <i className="col-xs-1 fa fa-tag zero-padding" style={{textAlign: 'right'}}/>
        </div>
        <div className="col-xs-12">
          <small className="pull-left text-muted">{agendaItem.commentsCount} comments</small>
          <small className="pull-right text-muted">#{conversation.title}</small>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    conversation: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  selectAgendaItem: PropTypes.func.isRequired
};

export default AgendaItem;