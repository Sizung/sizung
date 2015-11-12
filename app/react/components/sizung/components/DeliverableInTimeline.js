// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Time from 'react-time'
import User from './User'

class DeliverableInTimeline extends React.Component {
  constructor() {
    super();

    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    }
  }

  render() {
    const { deliverable } = this.props;
    const { agendaItem } = deliverable.agendaItem;
    return  <div style={[styles.base]} className="col-xs-12 margin-xs-vertical">
              <div className="col-xs-1">
                <User user={deliverable.owner} />
              </div>
              <div className="col-xs-11 zero-padding">
                {deliverable.title}
                <i className="fa fa-tasks" style={{marginLeft: '1em'}} />
                <div className="pull-left col-xs-12 zero-padding margin-xs-vertical text-muted">
                  <small><Time value={deliverable.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
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

DeliverableInTimeline.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    agendaItem: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Radium(DeliverableInTimeline);