import React, { PropTypes } from 'react';
import styles from './index.css';
import FormInput from '../FormInput';
import TextInput from '../TextInput';
import * as api from '../../utils/api';

class SignUpInformation extends React.Component {

  static propTypes = {
    setCurrentStage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      firstNameErrorMessage: '',
      lastNameErrorMessage: '',
    };
  }

  handleSubmitClick = () => {
    let user = {
      email: this.props.user.email,
      first_name: this.props.user.firstName,
      last_name: this.props.user.lastName,
      password: this.props.user.password,
      password_confirmation: this.props.user.passwordConfirmation,
    };
    if (this.validateForm()) {
      api.postJson('/api/users', user, (json) => {
        alert(JSON.stringify(json));
      });
    }
  };

  handleBackClick = () => {
    this.props.setCurrentStage('credentials');
  };

  validateForm = () => {
    if (this.validateFirstName() && this.validateLastName()) {
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

  render() {
    const { firstName, lastName } = this.props.user;
    return (
      <div className={styles.root}>
        <div className={styles.leftColumn}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
            </div>
            <div className={styles.logoTitle}>
            </div>
          </div>
          <div className={styles.stagesContainer}>
            <div className={styles.previousStage}>
              <span style={{ marginRight: '10px'}}>
                Credentials
              </span>
              <span className={styles.tick}>
              </span>
            </div>
            <div className={styles.currentStage}>
              <span style={{ marginRight: '10px'}}>
                Information
              </span>
              <span className={styles.caretLeftWhite}>
              </span>
            </div>

          </div>
        </div>
        <div className={styles.rightColumn} >
          <div className={styles.formContainer}>
            <div className={styles.formTitle}>
              Add your profile Information
            </div>
            <div className={styles.formSubTitle}>
              Just a little information about you.
            </div>
            <TextInput value={firstName} type={'firstName'} validate={this.validateFirstName} setUser={this.props.setUser} errorMessage={this.state.firstNameErrorMessage}/>
            <TextInput value={lastName} type={'lastName'} validate={this.validateLastName} setUser={this.props.setUser} errorMessage={this.state.lastNameErrorMessage}/>
            <div className={styles.actionContainer}>
              <div className={styles.backLink} onClick={this.handleBackClick}>
                <span className={styles.caretLeftBlack}></span>
                <span style={{marginLeft: '10px'}}>BACK</span>
              </div>
              <div className={styles.formSubmit} onClick={this.handleSubmitClick}>
                SUBMIT
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpInformation;
