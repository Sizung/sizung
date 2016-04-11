import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import * as api from '../../utils/api';

class SignUpCredentials extends React.Component {

  static propTypes = {
    setCurrentStage: PropTypes.func.isRequired,
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
    if (this.validateForm()) {
      this.props.setCurrentStage(1);
    }
  };

  validateForm = () => {
    if (this.validateEmail() && this.validatePassword() && this.validatePasswordConfirmation()) {
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
            errorMessage = 'This email address is already taken';
          }
          this.setState({ emailErrorMessage: errorMessage });
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

  render() {
    const { email, password, passwordConfirmation } = this.props.user;
    return (
      <div className={styles.formContainer}>
        <div className={styles.formTitle}>
          Add your credentials
        </div>
        <div className={styles.formSubTitle}>
          Add your email address as a username to sign into Sizung, along with a secure password.
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='email' value={email} label={'EMAIL ADDRESS'} placeholder='eg: username@domain.com' validate={this.validateEmail} onChange={this.setUserEmail} errorMessage={this.state.emailErrorMessage}/>
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='password' value={password} label={'PASSWORD'}  placeholder='min 8 character password' validate={this.validatePassword} onChange={this.setUserPassword} errorMessage={this.state.passwordErrorMessage} />
        </div>
        <div className={styles.formInputContainer}>
          <FormInput type='password' value={passwordConfirmation} label={'CONFIRM PASSWORD'} validate={this.validatePasswordConfirmation} onChange={this.setUserPasswordConfirmation} errorMessage={this.state.passwordConfirmationErrorMessage}/>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.formSubmit} onClick={this.handleNextClick} tab-index='4'>
            NEXT
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpCredentials;
