// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Comment extends React.Component {
  render() {
    return <div style={{marginTop: '1em'}}>
            <div><strong>{ this.props.author.name }</strong> <small>Today at 11:57 AM</small></div>
            <div>{this.props.body}</div>
          </div>;
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired
};

export default Comment;