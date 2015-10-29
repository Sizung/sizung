// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class User extends React.Component {
  render() {
    let { email, presence_status } = this.props.user;

    return (
      <div>
        assettest
        <span>{ presence_status } { email }</span>
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.object.isRequired
};

export default User;