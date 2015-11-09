// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Time from 'react-time'
import User from './User'

class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();

    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    }
  }

  render() {
    const { agendaItem } = this.props;
    const { conversation } = agendaItem.conversation
    return  <div style={[styles.base]} className="col-xs-12 margin-xs-vertical">
              <div className="col-xs-1">
                <User user={agendaItem.owner} />
              </div>
              <div className="col-xs-11 zero-padding">
                {agendaItem.title}
                <i className="fa fa-tag" style={{marginLeft: '1em'}} />
                <div className="pull-left col-xs-12 zero-padding margin-xs-vertical text-muted">
                  <small><Time value={agendaItem.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
                </div>
              </div>
            </div>;
  }
}

var styles = {
  base: {
    marginTop: '1em',

    ':hover': {}
  }
};

AgendaItemInTimeline.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    commentsSize: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    conversation: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Radium(AgendaItemInTimeline);