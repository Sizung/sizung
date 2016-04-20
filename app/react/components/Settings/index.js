import React from 'react';
import styles from './index.css';
import ProfileSettings from '../ProfileSettings';
import OrganizationSettings from '../OrganizationSettings';
import { Link } from 'react-router';
import CloseIcon from '../CloseIcon';

// TODO: ANI: Please use .jsx for all js files that have jsx in them
class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      currentOption: 'profile',
      user: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirmation: '',
      },
    };
  }

  componentWillMount() {
    this.setUser(this.props.currentUser);
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


  getOptionLabelStyle = (option) => {
    if (option === this.state.currentOption) {
      return styles.currentOption;
    }
    return styles.option;
  };

  saveUser = (user) => {
    this.props.updateUser(this.props.currentUser.id, user);
  };

  renderOptions = () => {
    if (this.state.currentOption === 'profile') {
      return (<ProfileSettings currentOrganization={this.props.currentOrganization} user={this.state.user} setUser={this.setUser} onSave={this.saveUser}/>);
    } else if (this.state.currentOption === 'organizations') {
      return (<OrganizationSettings {...this.props}/>);
    }
  };

  renderOptionLabel = (option) => {
    let optionLabel = '';
    const optionLabelStyle = this.getOptionLabelStyle(option);

    if (option === 'profile') {
      optionLabel = 'Profile';
    } else if (option === 'organizations') {
      optionLabel = 'Organizations';
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

  render() {
    const { currentOrganization } = this.props;
    if (currentOrganization) {
      const closeUrl = '/organizations/' + currentOrganization.id;
      return (
          <div className={styles.root}>
            <div className={styles.leftColumn}>
              <div className={styles.header}>
                <div className={styles.settingsIcon}>
                </div>
                <div className={styles.settingsLabel}>
                  SETTINGS
                </div>
              </div>
              <div className={styles.optionsContainer}>
                {this.renderOptionLabel('profile')}
                {this.renderOptionLabel('organizations')}
              </div>
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.closeIcon}>
                <Link to={closeUrl} title="Close">
                  <CloseIcon type={'transparent'}/>
                </Link>
              </div>
              {this.renderOptions()}
            </div>
          </div>
      );
    }
    return null;
  }
}

export default Settings;
