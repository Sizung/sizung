import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import User from '../User';
import ConversationIcon from '../ConversationIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class NavigationHeader extends Component {

  handleCurrentOrganizationClick = (event) => {
    if (!$(event.currentTarget).parent().hasClass('open')) {
      location.href = '/organizations/' + this.props.currentOrganization.id;
    }
  };

  conversationTitle = (currentConversation) => {
    if (currentConversation) {
      return (
        <div styleName='conversation-title-container'>
              <h5 title={currentConversation.title} styleName='conversation-title' >
                <Link to={'/organizations/' + currentConversation.organizationId} style={{ marginRight: '10px' }}>
                    <i styleName='conversation-close-icon'></i>
                </Link>
                <ConversationIcon inverted={true} size={'x-large'} style={{ marginRight: '5px' }}/>
                {currentConversation.title}
              </h5>
        </div>
      );
    }

    return <div styleName='conversation-title-container'></div>;
  };

  render() {
    const currentUserName = this.props.currentUser.firstName + " " + this.props.currentUser.lastName;
    const { organizations, currentOrganization, currentConversation } = this.props;
    //const organizationElements = organizations.filter(function(organization){
    //  return organization.id !== currentOrganization.id;
    //}).map(function(organization){
    //  return <li key={organization.id}><a href={'/organizations/' + organization.id}>{organization.name}</a></li>;
    //});
    const organizationElements = organizations.map(function (organization) {
      if (currentOrganization && organization.id === currentOrganization.id) {
        return <li className='active' key={organization.id}><Link to={'/organizations/' + organization.id}>{organization.name}</Link></li>;
      } else {
        return <li key={organization.id}><Link to={'/organizations/' + organization.id}>{organization.name}</Link></li>;
      }
    });

    return (
      <div styleName='root'>
        <div styleName='main-container'>
          <div styleName='navbar-container'>
            <div styleName='organization-dropdown-container'>
              <ul styleName='organisation-dropdown-nav'>
                <li>
                  <a styleName='organisation-dropdown' href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <span styleName='caret'></span><span>{currentOrganization ? currentOrganization.name : ''}</span>
                  </a>
                  <ul styleName='organisation-dropdown-menu'>
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
            { this.conversationTitle(null) }
            <div styleName='user-dropdown-container'>
              <ul styleName='user-dropdown-nav'>
                <li styleName='user-dropdown-nav-item'>
                  <a styleName='user-dropdown' href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <div styleName='user-container-visible-xs'>
                      <User  user={this.props.currentUser} size='normal' showName={false}/>
                    </div>
                    <div styleName='user-container-hidden-xs'>
                      <span styleName='caret' style={{marginTop: '15px'}}></span><User user={this.props.currentUser} size='normal' showName={true} style={{paddingRight: '10px'}}/>
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
    name: PropTypes.string.isRequired,
  }).isRequired,
  currentOrganization: PropTypes.object,
};

export default NavigationHeader;
