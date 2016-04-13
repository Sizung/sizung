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

  renderOrganizationMemberList = () => {
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
    const { organizations, currentOrganization } = this.props;
    return (
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>
            TEAM SETTINGS
          </div>
          <div>
            {this.renderOrganizationList()}
          </div>
          <div className={styles.organizationName}>
            <EditableText text={currentOrganization.name} onUpdate={this.handleOrganizationNameUpdate} editable maxLength={15} />
          </div>
          <div className={styles.membersLabel}>
            MEMBERS
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.searchInputContainer}>
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
        </div>
    );
  }
}

export default OrganizationSettings;
