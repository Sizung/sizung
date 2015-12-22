import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import User from '../User';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class NavigationHeader extends Component {

  toggleConversationMembersView() {

  }

  render() {
    const currentUserName = this.props.currentUser.firstName + " " + this.props.currentUser.lastName;
    const { organizations, currentOrganization, currentConversation, users } = this.props;
    const organizationElements = organizations.filter(function(organization){
      return organization.id !== currentOrganization.id;
    }).map(function(organization){
      return <li key={organization.id}><a href={'/organizations/' + organization.id}>{organization.name}</a></li>;
    });

    return (
      <div styleName='root'>
        <div styleName='main-container'>
          <div styleName='navbar-container'>
            <div className='col-xs-3 zero-padding zero-margin'>
              <ul styleName='organisation-dropdown-nav' style={{ display: 'inline-block', maxWidth: '100%'}}>
                <li >
                  <a style={{ padding: '15px'}}  styleName='organisation-dropdown' href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    {currentOrganization.name} <span className="caret hidden"></span>
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
            <div className='col-xs-6 nav navbar-nav zero-padding zero-margin' style={{ padding: '0px 10px'}}>
                <div styleName="conversation-title-container">
                  <h5 styleName='conversation-title'>
                    {" " + currentConversation.title}
                  </h5>
                  <a styleName='conversation-close-button' href={"/organizations/" + currentConversation.organization_id + "/conversations"}>
                    <small style={{ color: 'white'}}>(Back)</small>
                  </a>
                </div>
            </div>
            <div className='col-xs-3 zero-padding zero-margin'>
              <ul styleName='user-dropdown-nav' style={{display: 'inline-block'}} className='pull-right' >
                <li className="dropdown">
                  <a styleName='user-dropdown' className="dropdown-toggle" href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <User user={this.props.currentUser} size='normal' showName={false}/>
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