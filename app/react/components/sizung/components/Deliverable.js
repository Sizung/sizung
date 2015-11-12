// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Deliverable extends React.Component {
    render() {
      const { deliverable } = this.props;
      const { title, agendaItem } = deliverable;

        return <div className="row white-bg padding-sm-vertical margin-xs-vertical box-shadow">
          <div className="col-xs-12">
            <span className="col-xs-11 zero-padding" style={{textAlign: 'left'}}>{ title }</span>
            <i className="col-xs-1 fa fa-tasks zero-padding" style={{textAlign: 'right'}}></i>
          </div>
          <div className="col-xs-12" style={{marginTop: '5px'}}>
            <div className="pull-left col-xs-6 zero-padding text-muted">
              <div className="circle-sm">
                <span className="circle-text-sm">nA</span>
              </div>
            </div>
            <small className="pull-right col-xs-6 zero-padding text-muted" style={{textAlign: 'right'}}># {agendaItem.title}</small>
          </div>
        </div>;

    }
}

Deliverable.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    agendaItem: PropTypes.object.isRequired
  }).isRequired
};

export default Deliverable;