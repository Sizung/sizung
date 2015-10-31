// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';

class AgendaItem extends React.Component {
  render() {
    return <div className="row white-bg padding-sm-vertical margin-xs-vertical box-shadow">
        <div className="col-xs-12">
          <strong className="pull-left">{ this.props.title }</strong>
          <i className="pull-right" glyph="tag" />
        </div>
        <div className="col-xs-12">
          <small className="pull-left">{this.props.commentsSize} comments</small>
          <small className="pull-right">#{this.props.conversationTitle}</small>
        </div>
      </div>;
  }
}

AgendaItem.propTypes = {
  title: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string.isRequired,
  commentsSize: PropTypes.number.isRequired
};

export default AgendaItem;