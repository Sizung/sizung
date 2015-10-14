// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Comment extends React.Component {
  render() {
    return <div>Comment: { this.props.body } by { this.props.author.name }</div>;
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired
};

export default Comment;