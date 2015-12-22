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
    this.handleConversationTitleMouseEnter = this.handleConversationTitleMouseEnter.bind(this);
    this.handleConversationTitleMouseLeave = this.handleConversationTitleMouseLeave.bind(this);
  }

  handleCurrentOrganizationClick(event) {
    if ( !$(event.currentTarget).parent().hasClass('open')) {
      location.href = '/organizations/' + this.props.currentOrganization.id;
    }

  }

  handleConversationTitleMouseEnter() {
    $(this.conversationTitleNode).removeClass('col-xs-12');
    $(this.conversationTitleNode).addClass('col-xs-10');
    $(this.conversationOptionsNode).removeClass('hidden');
    $(this.conversationOptionsNode).addClass('col-xs-2');
  }

  handleConversationTitleMouseLeave() {
    $(this.conversationTitleNode).removeClass('col-xs-10');
    $(this.conversationTitleNode).addClass('col-xs-12');
    $(this.conversationOptionsNode).removeClass('col-xs-2');
    $(this.conversationOptionsNode).addClass('hidden');

  }

  componentDidMount() {
    this.conversationTitleNode = React.findDOMNode(this.refs.conversationTitle);
    this.conversationOptionsNode = React.findDOMNode(this.refs.conversationOptions);
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

    this.dummyUser = {
      firstName: currentOrganization.name,
      lastName: currentOrganization.name
    }

    return (
      <div styleName='root'>
        <div styleName='main-container'>
          <div styleName='navbar-container'>
            <div className='col-xs-3 zero-padding zero-margin'>
              <ul  styleName='organisation-dropdown-nav' style={{ display: 'inline-block', maxWidth: '100%'}}>
                <li styleName='orgDropdown'>
                  <a onClick={this.handleCurrentOrganizationClick} styleName='user-dropdown' className="dropdown-toggle" href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <i className='fa fa-home fa-2x'></i>
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
                <div onMouseEnter={this.handleConversationTitleMouseEnter} onMouseLeave={this.handleConversationTitleMouseLeave} styleName="conversation-title-container">
                  <h5 ref='conversationTitle' styleName='conversation-title' className='col-xs-12'>
                    {" " + currentConversation.title}
                  </h5>
                  <a ref='conversationOptions' className='hidden' styleName='conversation-close-button' href={"/organizations/" + currentConversation.organization_id + "/conversations"}>
                    <span className='pull-right' style={{ color: 'white'}}><i className='fa fa-times fa-lg'></i></span>
                  </a>
                </div>
            </div>
            <div className='hidden-xs col-xs-3 zero-padding zero-margin'>
              <ul styleName='user-dropdown-nav' className='pull-right' >
                <li className="dropdown">
                  <a styleName='user-dropdown' className="dropdown-toggle" href="#" data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                    <User user={this.props.currentUser} size='normal' showName={true}/>
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
            <div className='visible-xs col-xs-3 zero-padding zero-margin'>
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