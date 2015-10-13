// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class AgendaItem extends React.Component {
  render() {
    return <div className="row well well-small"> <strong className="col-xs-12">{ this.props.title }</strong>
           <small className="col-xs-12">#{this.props.conversationTitle}</small>
           <small className="col-xs-12">{this.props.commentsSize} comments</small></div>;
  }
}

AgendaItem.propTypes = {
  title: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string.isRequired,
  commentsSize: PropTypes.number.isRequired
};

export default AgendaItem;