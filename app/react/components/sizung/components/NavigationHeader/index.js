import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import User from '../User';
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
              <Dropdown styleName='user-dropdown' id='userDropdown' ref='userDropdown' pullRight>
                <Dropdown.Toggle styleName='user-dropdown-toggle' bsStyle='default' bsSize="small" noCaret>
                  <User user={this.props.currentUser} size='large'/>
                </Dropdown.Toggle>
                <Dropdown.Menu styleName='user-dropdown-menu'>
                  <MenuItem href="/users/edit">
                    Edit Profile
                  </MenuItem>
                  <MenuItem href="/users/sign_out">
                    Sign Out
                  </MenuItem>
                </Dropdown.Menu>
              </Dropdown>
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