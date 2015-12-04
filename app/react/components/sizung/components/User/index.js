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
    const {style, showName} = this.props;
    let { email, presenceStatus, firstName, lastName } = this.props.user;
    const initials = (firstName && lastName) ? firstName.charAt(0) + lastName.charAt(0) : email.charAt(0);
    const onlineState = presenceStatus === 'online' ? '-online' : '';
    var userLogoSize = ( this.validSizes.indexOf(this.props.size) == -1 ) ? this.validSizes[0] : this.props.size ;
    const name = showName ? <span styleName="name">{firstName + ' ' + lastName}</span> : '';

    return (
      <span styleName='root' title={email} style={style}>
        <div styleName={'circle-badge-' + userLogoSize + onlineState}>
          {initials}
        </div>
        {name}
      </span>
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
  style: {}
};

export default User;