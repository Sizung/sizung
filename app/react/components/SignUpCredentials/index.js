import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import EmailInput from '../EmailInput';
import PasswordInput from '../PasswordInput';
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
      }
      //else {
      //  api.fetchJson('/api/users?email=' + email, (json) => {
      //    if (json.emailExists) {
      //      errorMessage = 'This email address is already taken';
      //    }
      //    this.setState({ emailErrorMessage: errorMessage });
      //  });
      //}
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
        <EmailInput value={email} validate={this.validateEmail} setUser={this.props.setUser} errorMessage={this.state.emailErrorMessage} infoMessage={this.state.emailInfoMessage}/>
        <PasswordInput value={password} type={'password'} validate={this.validatePassword} setUser={this.props.setUser} errorMessage={this.state.passwordErrorMessage} />
        <PasswordInput value={passwordConfirmation} type={'passwordConfirmation'} validate={this.validatePasswordConfirmation} setUser={this.props.setUser} errorMessage={this.state.passwordConfirmationErrorMessage}/>
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
