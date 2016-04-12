import React from 'react';
import styles from './index.css';
import ProfileSettings from '../ProfileSettings';
import OrganizationSettings from '../OrganizationSettings';
import * as api from '../../utils/api';

class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      currentOption: 0,
      user: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirmation: '',
      },
    };
  }

  setCurrentSettingOption = (option) => {
    this.setState({
      currentOption: option,
    });
  };

  setUser = (user) => {
    this.setState({
      user: {
        email: ((user.email !== undefined) ? user.email : this.state.user.email),
        firstName: ((user.firstName !== undefined) ? user.firstName : this.state.user.firstName),
        lastName: ((user.lastName !== undefined) ? user.lastName : this.state.user.lastName),
        password: ((user.password !== undefined) ? user.password : this.state.user.password),
        passwordConfirmation: ((user.passwordConfirmation !== undefined) ? user.passwordConfirmation : this.state.user.passwordConfirmation),
      },
    });
  };

  saveUser = (user) => {
    api.putJson('/api/users/'+this.props.currentUser.id, user, (json) => {
      alert('user updated successfully');
    });
  };

  renderOptions = () => {
    if (this.state.currentOption === 0) {
      return (<ProfileSettings user={this.state.user} setUser={this.setUser} onSave={this.saveUser}/>);
    } else if (this.state.currentOption === 1) {
      return (<OrganizationSettings organizationMembers={this.props.organizationMembers} organizations={this.props.organizations} currentOrganization={this.props.currentOrganization}/>);
    }
  };

  getOptionLabelStyle = (option) => {
    if (option === this.state.currentOption) {
      return styles.currentOption;
    }
    return styles.option;
  };

  renderOptionLabel = (option) => {
    let optionLabel = '';
    const optionLabelStyle = this.getOptionLabelStyle(option);
    if (option === 0) {
      optionLabel = 'Profile';
    } else if (option === 1) {
      optionLabel = 'Teams';
    }
    return (
      <div className={optionLabelStyle} onClick={this.setCurrentSettingOption.bind(this, option)}>
          <span className={styles.optionLabel}>
            {optionLabel}
          </span>
          <span className={styles.optionIndicator}>
          </span>
      </div>
    );
  };

  componentWillMount() {
    this.setUser(this.props.currentUser);
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.leftColumn}>
          <div className={styles.header}>
            <div className={styles.settingsLogo}>
            </div>
            <div className={styles.settingsLabel}>
              SETTINGS
            </div>
          </div>
          <div className={styles.optionsContainer}>
            {this.renderOptionLabel(0)}
            {this.renderOptionLabel(1)}
          </div>
        </div>
        <div className={styles.rightColumn} >
          {this.renderOptions()}
        </div>
      </div>
    );
  }
}

export default Settings;
