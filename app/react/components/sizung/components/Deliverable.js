// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Deliverable extends React.Component {
    render() {
        return <div className="row white-bg padding-sm-vertical margin-xs-vertical">
          <div className="col-xs-12">
            <strong className="col-xs-11 zero-padding">{ this.props.body }</strong>
            <i className="col-xs-1 fa fa-tasks zero-padding"></i>
          </div>
          <div className="col-xs-12">
            <small className="pull-left col-xs-6 zero-padding">{ this.props.assignee }</small>
            <small className="pull-right col-xs-6 zero-padding"># { this.props.conversationTitle }</small>
          </div>
        </div>;

    }
}

Deliverable.propTypes = {
    body: PropTypes.string.isRequired,
    assignee: PropTypes.string.isRequired,
    conversationTitle: PropTypes.string.isRequired
};

export default Deliverable;