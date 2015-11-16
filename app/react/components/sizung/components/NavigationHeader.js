import React, { Component, PropTypes } from 'react';

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
              <li><a href="/users/edit">{currentUserName}</a></li>
              <li><a href="/users/sign_out" rel="nofollow" data-method="delete">Logout</a></li>
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