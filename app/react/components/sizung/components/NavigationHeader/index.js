import React, { Component, PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class NavigationHeader extends Component {
  render() {
    const currentUserName = this.props.currentUser.firstName + " " + this.props.currentUser.lastName;
    return (
      <div styleName='root'>
        <div styleName='main-container'>
          <div syleName='navbar-container' >
            <ul styleName='organisation-dropdown-nav'>
              <li><a href="/organizations">Organizations</a></li>
            </ul>
            <ul styleName='user-dropdown-nav'>
              <DropdownButton styleName='user-dropdown' bsStyle='default' title={currentUserName} id='userDropdown' noCaret>
                <li><a href="/users/edit">Edit Profile</a></li>
                <li><a href="/users/sign_out" rel="nofollow" data-method="delete">Logout</a></li>
              </DropdownButton>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

NavigationHeader.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default NavigationHeader;