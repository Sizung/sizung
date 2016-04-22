import React from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
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

  setUserEmail = (email) => {
    this.setState({ email });
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

  handleOrganizationClick = (organizationId) => {
    this.props.selectOrganization(organizationId);
  };

  renderOrganizationList = () => {
    const { organizations, currentOrganization } = this.props;

    return organizations.entrySeq().map((org) => {
      return (
        <div key={org[1].id} className={org[1].id === currentOrganization.id ? styles.organizationLogoSelected : styles.organizationLogo} onClick={this.handleOrganizationClick.bind(this, org[1].id)}>
          <OrganizationIcon name={org[1].name} url={'#'} reactLink={false}/>
        </div>
      );
    });
  };

  handleOrganizationNameUpdate = (name) => {
    this.props.updateOrganization(this.props.currentOrganization.id, { name });
  };

  handleDeleteOrganizationMember = (id) => {
    this.props.deleteOrganizationMember(id);
  };

  handleInviteMemberSubmit = () => {
    if (this.validateEmail()) {
      this.props.inviteOrganizationMember(this.props.currentOrganization.id, this.state.email);
      this.setState({ email: '' });
    }
  };

  resetInputValidation = () => {
    this.setState({ email: '', emailErrorMessage: '' });
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.triggerCancel();
    }
  };

  triggerCancel = () => {
    this.setState({ filter: '' });
    this.refs.memberFilter.value = '';
  };

  filteredOptions = (filter, options) => {
    return options.filter(function (option) {
      return ((option.firstName && option.lastName) ? (option.firstName + ' ' + option.lastName).toLowerCase().indexOf(filter.toLowerCase()) > -1 : (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1);
    });
  };

  renderOrganizationMemberList = () => {
    return (
      this.filteredOptions(this.state.filter, this.props.organizationMembers).entrySeq().map((obj) => {
        const organizationMemberId = obj[0];
        const user = obj[1];
        return (
          <div key={user.id} className={styles.organizationMember}>
            <div className={styles.userLogoContainer}>
              <User user={user} size={'large'}/>
              <div className={styles.action} onClick={this.handleDeleteOrganizationMember.bind(this, organizationMemberId)}>
                &times;
              </div>
            </div>
            <div className={styles.userTitleContainer}>
              { (user.firstName && user.lastName) ? user.firstName + ' ' + user.lastName : user.email }
            </div>
          </div>
        );
      })
    );
  };

  renderTeamSettings = () => {
    const { currentOrganization } = this.props;
    return (
      <div>
        {this.renderOrganizationList()}
        <a href={'/organizations/new'} title={'+ New Organization'} className={styles.organizationLogo}>
          <PlusIcon inverted style={{ fontSize: '2rem' }}/>
        </a>
        <div className={styles.organizationName}>
          <EditableText text={currentOrganization.name} onUpdate={this.handleOrganizationNameUpdate} editable maxLength={40}/>
        </div>
      </div>
    );
  };

  renderMemberSettings = () => {
    return (
      <div>
        <div className={styles.inviteContainer}>
          <div className={styles.emailInputContainer}>
            <FormInput type='email' value={this.state.email} label={'ADD MEMBER'} placeholder='e.g. user@domain.com' onChange={this.setUserEmail} onSubmit={this.handleInviteMemberSubmit} onCancel={this.resetInputValidation} errorMessage={this.state.emailErrorMessage}/>
          </div>
          <div className={styles.inviteMemberLink} onClick={this.handleInviteMemberSubmit}>
            Invite
          </div>
        </div>
        <div className={styles.searchInputContainer}>
          <div className={styles.searchIcon}>
          </div>
          <input ref='memberFilter' type="text" className={styles.filterInput} placeholder="SEARCH MEMBERS" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange}/>
        </div>
        <div className={styles.organizationMembersContainer}>
          {this.renderOrganizationMemberList()}
        </div>
      </div>
    );
  };

  render() {
    return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>
        ORGANIZATION SETTINGS
      </div>
      {this.renderTeamSettings()}
      <div className={styles.membersLabel}>
        MEMBERS
      </div>
      {this.renderMemberSettings()}
    </div>
    );
  }
}

export default OrganizationSettings;
