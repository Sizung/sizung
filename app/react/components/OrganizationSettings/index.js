import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import { Link } from 'react-router';
import * as api from '../../utils/api';
import OrganizationIcon from '../OrganizationIcon';
import EditableText from '../EditableText';
import User from '../User';

class OrganizationSettings extends React.Component {

  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      currentOrganizationIndex: 0,
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

  handleOrganizationClick = (index) => {
    this.setState({ currentOrganizationIndex: index });
  };

  renderOrganizationList = () => {
    const { organizations } = this.props;

    return organizations.map((org, index) => {
      return (
        <div className={index === this.state.currentOrganizationIndex ? styles.organizationLogoSelected : styles.organizationLogo} onClick={this.handleOrganizationClick.bind(this, index)}>
          <OrganizationIcon key={org.id} name={org.name} url={'#'} reactLink={false}/>
        </div>
      );
    });
  };

  handleOrganizationNameUpdate = () => {

  };

  renderOrganizationMemberList = () => {
    //let org = this.props.organizationMembers.filter((org) => {
    //  return org.id === organizationId
    //})[0];

    console.log('organizationMembers: ' + JSON.stringify(this.props.organizationMembers));
    return (
      this.props.organizationMembers.map((user) => {
        return (
            <div className={styles.organizationMember}>
              <User key={user.id} user={user} showName/>
            </div>
        );
      })
    );

    return null;
  };

  render() {
    const { organizations } = this.props;
    console.log('organizations: ' + JSON.stringify(organizations));
    return (
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>
            TEAM SETTINGS
          </div>
          <div>
            {this.renderOrganizationList()}
          </div>
          <div className={styles.organizationName}>
            <EditableText text={organizations.get(this.state.currentOrganizationIndex).name} onUpdate={this.handleOrganizationNameUpdate} editable maxLength={15} />
          </div>
          <div className={styles.formTitle}>
            MEMBERS
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.organizationName}>
              <input type="text" className={styles.filterInput} id="memberName"
                     placeholder="SEARCH MEMBERS" onKeyDown={this.handleKeyDown}
                     onChange={this.handleFilterChange}
                  />
            </div>
            <div className={styles.inviteMemberLink}>
              Invite New Members
            </div>
          </div>
          <div className={styles.organizationMembersContainer}>
            {this.renderOrganizationMemberList()}
          </div>
          <div className={styles.actionContainer}>
            <div className={styles.formSubmit} onClick={this.handleSave} tab-index='4'>
              SAVE
            </div>
            <div className={styles.backLink} onClick={this.handleCancel}>
              CANCEL
            </div>
          </div>
        </div>
    );
  }
}

export default OrganizationSettings;
