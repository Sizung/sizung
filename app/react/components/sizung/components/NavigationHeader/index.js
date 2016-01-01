import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import User from '../User';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class NavigationHeader extends Component {

  constructor(){
    super();
    this.handleCurrentOrganizationClick = this.handleCurrentOrganizationClick.bind(this);
  }

  handleCurrentOrganizationClick(event) {
    if ( !$(event.currentTarget).parent().hasClass('open')) {
      location.href = '/organizations/' + this.props.currentOrganization.id;
    }

  }

  render() {
    const currentUserName = this.props.currentUser.firstName + " " + this.props.currentUser.lastName;
    const { organizations, currentOrganization, currentConversation, users } = this.props;
    //const organizationElements = organizations.filter(function(organization){
    //  return organization.id !== currentOrganization.id;
    //}).map(function(organization){
    //  return <li key={organization.id}><a href={'/organizations/' + organization.id}>{organization.name}</a></li>;
    //});
    const organizationElements = organizations.map(function(organization){
      if ( organization.id !== currentOrganization.id ) {
        return <li key={organization.id}><a href={'/organizations/' + organization.id}>{organization.name}</a></li>;
      } else {
        return <li className='active' key={organization.id}><a href={'/organizations/' + organization.id}>{organization.name}</a></li>;
      }
    });

    return (
      <div styleName='root'>
        <div styleName='main-container'>
          <div styleName='navbar-container'>
            <div styleName='organization-dropdown-container'>
              <ul styleName='organisation-dropdown-nav'>
                <li>
                  <a onClick={this.handleCurrentOrganizationClick} styleName='organisation-dropdown' href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <img styleName='logo' src={window.location.protocol + "//" + window.location.host + "/sizung_logo_white_on_black.gif"}/>
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
            </div>
            <div styleName='conversation-title-container'>
                  <h5 title={currentConversation.title} styleName='conversation-title' >
                      <a href={"/organizations/" + currentConversation.organization_id + "/conversations"}>
                        <i styleName='conversation-close-icon'></i>
                      </a>{" "}
                      <img src={window.location.protocol + "//" + window.location.host + "/icons/conversation-icon-white.png"}></img>
                      {" " + currentConversation.title}
                  </h5>
            </div>
            <div styleName='user-dropdown-container'>
              <ul styleName='user-dropdown-nav'>
                <li styleName='user-dropdown-nav-item'>
                  <a styleName='user-dropdown' href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <div styleName='user-container-visible-xs'>
                      <User  user={this.props.currentUser} size='normal' showName={false}/>
                    </div>
                    <div styleName='user-container-hidden-xs'>
                      <User  user={this.props.currentUser} size='normal' showName={true}/>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
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
      </div>
    );
  }
}

NavigationHeader.propTypes = {
  organizations: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  users: PropTypes.object.isRequired
};

export default NavigationHeader;