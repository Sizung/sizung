import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import { Link } from 'react-router';
import * as api from '../../utils/api';
import OrganizationIcon from '../OrganizationIcon';
import EditableText from '../EditableText';
import User from '../User';
import PlusIcon from '../PlusIcon';

class OrganizationSettings extends React.Component {

  static propTypes = {
  };

  constructor() {
    super();

    this.state = {
      filter: '',
      email: '',
      emailErrorMessage: '',
    };
  }

  handleSave = () => {
    if (this.validateForm()) {
      alert('Updating the form');
    }
  };

  handleCancel = () => {
    //Find the React way of doing it
    window.history.back();
  };

  handleOrganizationClick = (organizationId) => {
    this.props.selectOrganization(organizationId);
  };

  renderOrganizationList = () => {
    const { organizations, currentOrganization } = this.props;

    return organizations.map((org) => {
      return (
        <div className={org.id === currentOrganization.id ? styles.organizationLogoSelected : styles.organizationLogo} onClick={this.handleOrganizationClick.bind(this, org.id)}>
          <OrganizationIcon key={org.id} name={org.name} url={'#'} reactLink={false}/>
        </div>
      );
    });
  };

  handleOrganizationNameUpdate = (name) => {
    this.props.updateOrganization(this.props.currentOrganization.id, { name: name });
  };

  handleDeleteOrganizationMember = (id) => {
    this.props.deleteOrganizationMember(id);
  };

  handleInviteMemberClick = () => {
    //api.postJson('/users/invitation', { user: { organization_id: this.props.currentOrganization.id, email } }, (json) => {
    //  alert('user invited');
    //});
    if (this.validateEmail()) {
      this.props.inviteOrganizationMember(this.props.currentOrganization.id, this.state.email);
      this.setState({email: ''});
    }
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  };

  triggerCancel = () => {
    this.state = {
      filter: '',
    };
    this.refs.memberFilter.value = '';
  };

  handleInputSubmit = (event) => {
    event.preventDefault();
    const { filter } = this.state;

    const filteredOptions = this.filteredOptions(filter, this.props.organizationMembers);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  };

  filteredOptions = (filter, options) => {
    return options.filter(function (option) {
      //return ((option.firstName + ' ' + option.lastName).toLowerCase().indexOf(filter.toLowerCase()) > -1 || (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1);
      return (option.firstName && option.lastName ? (option.firstName + ' ' + option.lastName).toLowerCase().indexOf(filter.toLowerCase()) > -1 : (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1);
    });
  };

  renderOrganizationMemberList = () => {
    return (
        this.filteredOptions(this.state.filter, this.props.organizationMembers).map((user, id) => {
        return (
          <div className={styles.organizationMember}>
            <div className={styles.userLogoContainer}>
              <User key={user.id} user={user}/>
              <div className={styles.action} onClick={this.handleDeleteOrganizationMember.bind(this, id)}>
                &times;
              </div>
            </div>
            <div className={styles.userTitleContainer}>
              { user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.email}
            </div>
          </div>
        );
      })
    );
    return null;
  };

  validateEmail = () => {
    const { email } = this.state;
    let errorMessage = '';
    if (email === null || email === undefined || email.trim() === '') {
      errorMessage = 'Email Address cannot be empty';
    } else {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        errorMessage = 'Email Address is not valid';
      }
    }
    this.setState({ emailErrorMessage: errorMessage });

    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
  };

  setUserEmail = (email) => {
    this.setState({ email });
  };

  render() {
    const { organizations, currentOrganization } = this.props;
    return (
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>
            TEAM SETTINGS
          </div>
          <div>
            {this.renderOrganizationList()}
            <a href={'/organizations/new'} title={'+ New Organization'} className={styles.organizationLogo}>
              <PlusIcon inverted style={{ fontSize: '2rem' }}/>
            </a>
          </div>
          <div className={styles.organizationName}>
            <EditableText text={currentOrganization.name} onUpdate={this.handleOrganizationNameUpdate} editable maxLength={15} />
          </div>
          <div className={styles.membersLabel}>
            MEMBERS
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.emailInputContainer}>
              <div className={styles.formInputContainer}>
                <FormInput type='email' value={this.state.email} label={'EMAIL ADDRESS'} placeholder='eg: user@domain.com' onChange={this.setUserEmail} errorMessage={this.state.emailErrorMessage}/>
              </div>
            </div>
            <div className={styles.inviteMemberLink} onClick={this.handleInviteMemberClick}>
              Invite New Members
            </div>
          </div>
          <div className={styles.searchInputContainer}>
            <div className={styles.searchIcon}>
            </div>
            <input type="text" className={styles.filterInput}
                   placeholder="SEARCH MEMBERS" onKeyDown={this.handleKeyDown}
                   onChange={this.handleFilterChange}
                />
          </div>
          <div className={styles.organizationMembersContainer}>
            {this.renderOrganizationMemberList()}
          </div>
        </div>
    );
  }
}

export default OrganizationSettings;
