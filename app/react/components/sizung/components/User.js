// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class User extends React.Component {
  render() {
    let { email, presenceStatus, firstName, lastName } = this.props.user;
    let style = {};
    if (presenceStatus === 'online') {
      style = {borderBottom: '2px solid green'}
    }

    return (
      <div className="circle-sm">
        <span className="circle-text-sm" title={email} style={style}>{firstName.charAt(0) + lastName.charAt(0)}</span>
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    presenceStatus: PropTypes.string.isRequired
  }).isRequired
};

export default User;