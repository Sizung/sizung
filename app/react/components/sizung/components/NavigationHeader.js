import React, { Component, PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class NavigationHeader extends Component {
  render() {
    const currentUserName = this.props.currentUser.name;
    return (
      <div className="navbar navbar-default navbar-static-top zero-vertical-margin white-bg">
        <div className="container full-width">
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="navbar-responsive-collapse">
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <a className="navbar-brand" href="/">Sizung</a>
          <div className="navbar-collapse collapse navbar-responsive-collapse">
            <ul className="nav navbar-nav">
              <li><a href="/organizations">Organizations</a></li>
              <li><a href="/users/invitation/new">Invite your team</a></li>
            </ul>
            <ul className="nav nav-bar-nav pull-right" style={{ paddingTop: '10px'}}>
              <DropdownButton bsStyle='default' bsSize='small' title={currentUserName}>
                <MenuItem eventKey="1" href="/users/edit">Edit Profile</MenuItem>
                <MenuItem eventKey="2" href="/users/sign_out" rel="nofollow" data-method="delete">Logout</MenuItem>
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