import React from 'react';
import styles from './index.css';
import ProfileSettings from '../ProfileSettings';
import OrganizationSettings from '../OrganizationSettings';
import { browserHistory } from 'react-router';

// TODO: ANI: Please use .jsx for all js files that have jsx in them
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

  componentWillMount() {
    this.setUser(this.props.currentUser);
  }

  closeSettingsView = () => {
    // TODO: ANI: Please don't use browserHistory directly use https://github.com/reactjs/react-router-redux for that. Either <Link ...> or an action creator doing a push
    browserHistory.push('/organizations/' + this.props.currentOrganization.id);    
  };

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
    if (this.state.currentOption === 0) {
      return (<ProfileSettings user={this.state.user} setUser={this.setUser} onSave={this.saveUser} onClose={this.closeSettingsView}/>);
    } else if (this.state.currentOption === 1) {
      return (<OrganizationSettings {...this.props}/>);
    }
  };

  renderOptionLabel = (option) => {
    let optionLabel = '';
    const optionLabelStyle = this.getOptionLabelStyle(option);
    // TODO: ANI: Use more descriptive parameters like renderOptionLabel(0 or 1) for signaling which part should be listed
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

  render() {
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
