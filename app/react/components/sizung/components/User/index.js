// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)

class User extends React.Component {

  constructor() {
    super();
    this.validSizes = ['normal','large'];
  }

  render() {
    let { email, presenceStatus, firstName, lastName } = this.props.user;

    const initials = (firstName && lastName) ? firstName.charAt(0) + lastName.charAt(0) : email.charAt(0);

    let style = {};
    if (presenceStatus === 'online') {
      style = {color: '#7B7'}
    }

    var userLogoSize = ( this.validSizes.indexOf(this.props.size) == -1 ) ? this.validSizes[0] : this.props.size ;
    return (
      <div styleName={'circle-badge-' + userLogoSize} title={email} style={style}>
      {initials}
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
  }).isRequired,
  size: PropTypes.string.isRequired
};

User.defaultProps = {
  user: {
    email: 'bla',
    firstName: 'Foo',
    lastName: 'Bar',
    presenceStatus: 'offline'
  },
  size: "normal"
};

export default User;