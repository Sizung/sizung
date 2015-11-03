// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Time from 'react-time'

class Comment extends React.Component {
  constructor() {
    super();

    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    }
  }

  render() {
    return <div style={[styles.base]} className="col-xs-12 zero-padding margin-xs-vertical">
            <div className="col-xs-1">
              <div className="circle-sm">
                <span className="circle-text-sm">{this.props.author.name.split(' ')[0].charAt(0)+this.props.author.name.split(' ')[1].charAt(0)}</span>
              </div>
            </div>
            <div className="col-xs-11 zero-padding">
              {this.props.body}
              <div className="pull-left col-xs-12 zero-padding margin-xs-vertical text-muted">
                <small><Time value={this.props.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
                {Radium.getState(this.state, this.key, ':hover') ? (
                  <span style={{marginLeft: '1em'}}>
                    <a href='#' onClick={this.handleDeleteClick}>
                      <i className="fa fa-times" aria-label='Delete'></i>
                    </a>
                  </span>
                ) : null}
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

Comment.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  createdAt: PropTypes.string.isRequired
};

Comment.defaultProps = {
  author: {name: 'George Guest'}
};

export default Radium(Comment);