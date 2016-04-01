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

  handleNextClick = () => {
    if (this.validateForm()) {
      this.props.setCurrentStage(2);
    }
  };

  handleBackClick = () => {
    this.props.setCurrentStage(0);
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
          <div className={styles.formSubmit} onClick={this.handleNextClick}>
            NEXT
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpInformation;
