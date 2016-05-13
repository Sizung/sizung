import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import * as api from '../../utils/api';
import { Link } from 'react-router';

class SignUpCredentials extends React.Component {

  static propTypes = {
    setCurrentStep: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      emailErrorMessage: '',
      passwordErrorMessage: '',
      passwordConfirmationErrorMessage: '',
    };
  }

  handleNextClick = () => {
    this.validateForm();
    setTimeout(() => {
      this.setState({ validating: false });
      if (this.isFormValid()) {
        this.props.setCurrentStep(1);
      }
    }, 2000);
  };

  validateForm = () => {
    this.setState({ validating: true });
    this.validateEmail();
    this.validatePassword();
    this.validatePasswordConfirmation();
  };

  isFormValid = () => {
    if (this.state.emailErrorMessage === '' && this.state.passwordErrorMessage === '' && this.state.passwordConfirmationErrorMessage === '') {
      return true;
    }
    return false;
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
      } else {
        api.fetchJson('/api/users?email=' + email, (json) => {
          if (json.emailExists) {
            errorMessage = 'Email already registered. Please check your inbox for confirmation link.';
            this.setState({ emailErrorMessage: errorMessage });
          } else {
            this.setState({ emailErrorMessage: '' });
          }
        });
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
    if (password === null || password === undefined || password.trim() === '') {
      errorMessage = 'Password cannot be empty';
    } else {
      if (password.length < 8) {
        errorMessage = 'Minimum 8 characters required';
      }
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
    if (passwordConfirmation === null || passwordConfirmation === undefined || passwordConfirmation.trim() === '') {
      errorMessage = 'Password cannot be empty';
    } else if (passwordConfirmation !== password) {
      errorMessage = 'Passwords do not match';
    }
    this.setState({
      passwordConfirmationErrorMessage: errorMessage,
    });
    if (errorMessage !== null && errorMessage.trim() !== '') {
      return false;
    }
    return true;
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

  renderNextButton = () => {
    if (this.state.validating) {
      return (
        <div className={styles.formSubmitValidating} tab-index='4'>
          { 'NEXT '}<i className={styles.spinner}></i>
        </div>
      );
    }
    return (
      <div className={styles.formSubmit} onClick={this.handleNextClick} tab-index='4'>
        NEXT
      </div>
    );
  };

  renderResendConfirmationLink = () => {
    if (this.state.emailErrorMessage.indexOf('Email already registered. Please check your inbox for confirmation link.') > -1) {
      return (
        <div className={styles.resendConfirmationLinkContainer}>
          <a href={'/users/confirmation/new'} className={styles.resendConfirmationLink}>Resend Confirmation Link</a>
        </div>
      );
    }
    return null;
  };

  render() {
    const { email, password, passwordConfirmation } = this.props.user;
    return (
      <div className={styles.formContainer}>
        <div className={styles.formTitle}>
          Create an account
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='email' value={email} label={'EMAIL ADDRESS'} placeholder='e.g. name@email.com' validate={this.validateEmail} onChange={this.setUserEmail} onSubmit={this.handleNextClick} errorMessage={this.state.emailErrorMessage}/>
        </div>
        {this.renderResendConfirmationLink()}
        <div className={styles.formInputContainer}>
          <FormInput type='password' value={password} label={'PASSWORD'}  placeholder='minimum 8 characters' validate={this.validatePassword} onChange={this.setUserPassword} onSubmit={this.handleNextClick} errorMessage={this.state.passwordErrorMessage} />
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='password' value={passwordConfirmation} label={'CONFIRM PASSWORD'} validate={this.validatePasswordConfirmation} onChange={this.setUserPasswordConfirmation} onSubmit={this.handleNextClick} errorMessage={this.state.passwordConfirmationErrorMessage}/>
        </div>
        <div className={styles.actionContainer}>
          {this.renderNextButton()}
        </div>
      </div>
    );
  }
}

export default SignUpCredentials;
