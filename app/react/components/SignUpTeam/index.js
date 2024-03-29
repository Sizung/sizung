import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import * as api from '../../utils/api';
import { browserHistory } from 'react-router';

class SignUpTeam extends React.Component {

  static propTypes = {
    setCurrentStep: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired,
    setConfirmEmail: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      organizationNameErrorMessage: '',
    };
  }

  handleSubmitClick = () => {
    const user = {
      user: {
        email: this.props.user.email,
        first_name: this.props.user.firstName,
        last_name: this.props.user.lastName,
        password: this.props.user.password,
        password_confirmation: this.props.user.passwordConfirmation,
        organization: {
          name: this.props.user.organization.name,
        },
      },

    };
    if (this.validateForm()) {
      api.postJson('/api/users', user, (json) => {
        if (json.data && json.data.email === user.email) {
          this.props.setConfirmEmail(true);
        } else {
          alert('There was some problem registering the user');
        }
      });
    }
  };

  handleBackClick = () => {
    this.props.setCurrentStep(1);
  };

  validateForm = () => {
    if (this.validateOrganizationName()) {
      return true;
    }
    return false;
  };

  validateOrganizationName = () => {
    const { name } = this.props.user.organization;
    let errorMessage = '';
    if (!name || name.trim() === '') {
      errorMessage = 'Organization Name cannot be empty';
    }
    this.setState({
      organizationNameErrorMessage: errorMessage,
    });
    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
  };

  setOrganizationName = (text) => {
    this.props.setUser({ organization: { name: text } });
  };

  render() {
    const { name } = this.props.user.organization;
    return (
      <div className={styles.formContainer}>
        <div className={styles.formTitle}>
          Create an organization
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='text' label='ORGANIZATION' placeholder='' value={name} validate={this.validateOrganizationName} onChange={this.setOrganizationName} onSubmit={this.handleSubmitClick} errorMessage={this.state.organizationNameErrorMessage}/>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.backLink} onClick={this.handleBackClick}>
            <span className={styles.caretLeftBlack}></span>
            <span style={{ marginLeft: '10px' }}>BACK</span>
          </div>
          <div className={styles.formSubmit} onClick={this.handleSubmitClick}>
            SUBMIT
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpTeam;
