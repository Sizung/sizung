// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';

class AgendaItem extends React.Component {
  render() {
    const {agendaItem} = this.props;
    const {conversation} = this.props.agendaItem;

    return <div className="row white-bg padding-sm-vertical margin-xs-vertical box-shadow">
        <div className="col-xs-12">
          <span className="col-xs-11 zero-padding" style={{textAlign: 'left'}}>{ agendaItem.title }</span>
          <i className="col-xs-1 fa fa-tag zero-padding" style={{textAlign: 'right'}}/>
        </div>
        <div className="col-xs-12">
          <small className="pull-left text-muted">{agendaItem.commentsSize} comments</small>
          <small className="pull-right text-muted">#{conversation.title}</small>
        </div>
      </div>;
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    commentsSize: PropTypes.number.isRequired,
    conversation: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default AgendaItem;