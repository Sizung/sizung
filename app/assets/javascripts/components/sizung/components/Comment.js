// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Comment extends React.Component {
  render() {
    return <div>Comment: { this.props.text }</div>;
  }
}

Comment.propTypes = {
  text: PropTypes.string.isRequired
};

export default Comment;