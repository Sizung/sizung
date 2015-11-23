// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Deliverable extends React.Component {
  constructor() {
    super();

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectDeliverable(
        this.props.deliverable.agendaItem.conversationId,
        this.props.deliverable.agendaItem.id,
        this.props.deliverable.id
      );
    };
  }


    render() {
      const { deliverable, selected } = this.props;
      const { title, agendaItem } = deliverable;
      var style = {};
      style['marginTop'] = '5px;';
      if(selected === true) {
        style['backgroundColor'] = '#9C9';
      }

        return <div style={style} className="col-xs-12 white-bg padding-sm-vertical box-shadow" onClick={this.handleClick}>
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
  }).isRequired,
  selectDeliverable: PropTypes.func.isRequired
};

Deliverable.defaultProps = {
  deliverable: {
    title: 'foobar',
    agendaItem: {
      title: 'barfoo'
    }
  }
};

export default Deliverable;