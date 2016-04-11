import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import EmailInput from '../EmailInput';
import PasswordInput from '../PasswordInput';
import { Link } from 'react-router';
import * as api from '../../utils/api';

class ProfileSettings extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      firstNameErrorMessage: '',
      lastNameErrorMessage: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
      passwordConfirmationErrorMessage: '',
    };
  }

  handleSave = () => {
    const user = {
      user: {
        email: this.props.user.email,
        first_name: this.props.user.firstName,
        last_name: this.props.user.lastName,
        password: this.props.user.password,
        password_confirmation: this.props.user.passwordConfirmation,
      },
    };
    if (this.validateForm()) {
      this.props.onSave(user);
    }
  };

  handleCancel = () => {
    //Find the React way of doing it
    window.history.back();
  };

  validateForm = () => {
    if (this.validateFirstName() && this.validateLastName() && this.validatePassword() && this.validatePasswordConfirmation()) {
      return true;
    }
    return false;
  };

  validateFirstName = () => {
    const { firstName } = this.props.user;
    let errorMessage = '';
    if (firstName === null || firstName.trim() === '') {
      errorMessage = 'First Name cannot be empty';
    }
    this.setState({
      firstNameErrorMessage: errorMessage,
    });
    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
  };

  validateLastName = () => {
    const { lastName } = this.props.user;
    let errorMessage = '';
    if (lastName === null || lastName.trim() === '') {
      errorMessage = 'Last Name cannot be empty';
    }
    this.setState({
      lastNameErrorMessage: errorMessage,
    });
    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
  };

  validateEmail = () => {
    const { email } = this.props.user;
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

  validatePassword = () => {
    const { password } = this.props.user;
    let errorMessage = '';
    if (password && password.length > 0 && password.length < 8) {
      errorMessage = 'Minimum 8 characters required';
    }
    this.setState({
      passwordErrorMessage: errorMessage,
    });
    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
  };

  validatePasswordConfirmation = () => {
    const { passwordConfirmation, password } = this.props.user;
    let errorMessage = '';
    if (password && password.length > 0) {
      if (passwordConfirmation === null || passwordConfirmation === undefined || passwordConfirmation.trim() === '') {
        errorMessage = 'Password cannot be empty';
      } else if (passwordConfirmation !== password) {
        errorMessage = 'Passwords do not match';
      }
    }
    this.setState({
      passwordConfirmationErrorMessage: errorMessage,
    });
    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
  };

  setUserFirstName = (text) => {
    this.props.setUser({ firstName: text });
  };

  setUserLastName = (text) => {
    this.props.setUser({ lastName: text });
  };

  setUserEmail = (email) => {
    this.props.setUser({ email });
  };

  setUserPasswordConfirmation = (password) => {
    this.props.setUser({ passwordConfirmation: password });
  };

  setUserPassword = (password) => {
    this.props.setUser({ password });
  };

  render() {
    const { email, password, passwordConfirmation, firstName, lastName } = this.props.user;
    return (
      <div className={styles.formContainer}>
        <div className={styles.formTitle}>
          PROFILE DETAILS
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='text' label='FIRST NAME' value={firstName} validate={this.validateFirstName} onChange={this.setUserFirstName} errorMessage={this.state.firstNameErrorMessage}/>
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='text' label='LAST NAME' value={lastName} validate={this.validateLastName} onChange={this.setUserLastName} errorMessage={this.state.lastNameErrorMessage}/>
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='email' value={email} label={'EMAIL ADDRESS'} placeholder='eg: username@domain.com' validate={this.validateEmail} onChange={this.setUserEmail} errorMessage={this.state.emailErrorMessage} disabled/>
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='password' value={password} label={'RESET PASSWORD'}  placeholder='min 8 character password' validate={this.validatePassword} onChange={this.setUserPassword} errorMessage={this.state.passwordErrorMessage} />
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='password' value={passwordConfirmation} label={'CONFIRM NEW PASSWORD'} validate={this.validatePasswordConfirmation} onChange={this.setUserPasswordConfirmation} errorMessage={this.state.passwordConfirmationErrorMessage}/>
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

export default ProfileSettings;
