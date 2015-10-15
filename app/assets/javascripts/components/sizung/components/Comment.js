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
    return <div style={[styles.base]}>
            <div><strong>{ this.props.author.name }</strong> <small><Time value={this.props.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small></div>
            <div>
              {this.props.body}

              {Radium.getState(this.state, this.key, ':hover') ? (
                <span style={{marginLeft: '1em'}}>
                  <a href='#' onClick={this.handleDeleteClick}>
                    <i className="fa fa-times" aria-label='Delete'></i>
                  </a>
                </span>
              ) : null}
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

export default Radium(Comment);