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
    const {style, showName, showEmail} = this.props;
    let { email, presenceStatus, firstName, lastName } = this.props.user;
    const initials = (firstName && lastName) ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();
    const onlineState = presenceStatus === 'online' ? '-online' : '';
    var size = ( this.validSizes.indexOf(this.props.size) == -1 ) ? this.validSizes[0] : this.props.size ;
    const name = showName ? <span styleName="name">{firstName + ' ' + lastName}</span> : '';
    const userEmail = showEmail ? <span styleName="email"><small>({email})</small></span> : '';

    return (
      <div styleName='root' title={email} style={style}>
        <div styleName={'circle-badge-' + size + onlineState}>
          {initials}
        </div>
        <div styleName={'user-title-' + size} >
          {name}
          {userEmail}
        </div>
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
  size: PropTypes.string.isRequired,
  showName: PropTypes.bool,
  showEmail: PropTypes.bool,
  style: PropTypes.object
};

User.defaultProps = {
  user: {
    email: 'sizung@example.com',
    firstName: 'n',
    lastName: 'A',
    presenceStatus: 'offline'
  },
  size: "normal",
  showName: false,
  showEmail: false,
  style: {}
};

export default User;