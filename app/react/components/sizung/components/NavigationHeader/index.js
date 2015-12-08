import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import User from '../User';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class NavigationHeader extends Component {
  render() {
    const currentUserName = this.props.currentUser.firstName + " " + this.props.currentUser.lastName;
    const { organizations, currentOrganization } = this.props;
    const organizationElements = organizations.filter(function(organization){
      return organization.id !== currentOrganization.id;
    }).map(function(organization){
      return <li key={organization.id}><a href={'/organizations/' + organization.id}>{organization.name}</a></li>;
    });

    return (
      <div styleName='root'>
        <div styleName='main-container'>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-responsive-collapse">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div styleName='navbar-container'>
            <ul styleName='organisation-dropdown-nav' >
              <li>
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                  {currentOrganization.name} <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  {organizationElements}
                  <li className="divider" role="separator"></li>
                  <li>
                    <a href="/organizations/new">
                      <i className="fa fa-plus"></i>&nbsp;
                      <span>Add new organization</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <ul styleName='user-dropdown-nav'>
              <li className="dropdown">
                <a styleName='user-dropdown' className="dropdown-toggle" href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                  <User user={this.props.currentUser} size='normal' showName={true} /> <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/users/edit">Edit Profile</a>
                  </li>
                  <li>
                    <a href="/users/sign_out" data-method="delete">Sign out</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

NavigationHeader.propTypes = {
  organizations: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default NavigationHeader;