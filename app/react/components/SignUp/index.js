import React from 'react';
import SignUpInformation from '../SignUpInformation';
import SignUpCredentials from '../SignUpCredentials';
import SignUpTeam from '../SignUpTeam';
import styles from './index.css';


class SignUp extends React.Component {

  constructor() {
    super();
    this.state = {
      currentStep: 0,
      user: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirmation: '',
        organization: {
          name: '',
        },
      },
      confirmEmail: false,
    };
  }

  setConfirmEmail = (newState) => {
    this.setState({
      confirmEmail: newState,
    });
  };

  setCurrentStep = (newState) => {
    this.setState({
      currentStep: newState,
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
        organization: {
          name: ((user.organization !== undefined && user.organization.name !== undefined) ? user.organization.name : this.state.user.organization.name),
        },
      },
      confirmEmail: false,
    });
  };

  renderSteps = () => {
    if (this.state.currentStep === 0) {
      return (<SignUpCredentials setCurrentStep={this.setCurrentStep} user={this.state.user} setUser={this.setUser}/>);
    } else if (this.state.currentStep === 1) {
      return (<SignUpInformation setCurrentStep={this.setCurrentStep} user={this.state.user} setUser={this.setUser}/>);
    } else if (this.state.currentStep === 2) {
      return (<SignUpTeam setCurrentStep={this.setCurrentStep} user={this.state.user} setUser={this.setUser} setConfirmEmail={this.setConfirmEmail}/>);
    }
  };

  getStepLabelStyle = (step) => {
    if (step < this.state.currentStep) {
      return styles.previousStep;
    } else if (step === this.state.currentStep) {
      return styles.currentStep;
    }
    return styles.step;
  };

  renderStepLabel = (step) => {
    let stepLabel = '';
    const stepLabelStyle = this.getStepLabelStyle(step);
    if (step === 0) {
      stepLabel = 'Account';
    } else if (step === 1) {
      stepLabel = 'Profile';
    } else if (step === 2) {
      stepLabel = 'Create an Organization';
    }
    return (
      <div className={stepLabelStyle}>
          <span className={styles.stepLabel}>
            {stepLabel}
          </span>
          <span className={styles.stepIndicator}>
          </span>
      </div>
    );
  };

  renderConfirmationEmailPage = () => {
    return (
      <div className={styles.confirmEmailRoot}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
          </div>
          <div className={styles.logoTitle}>
          </div>
        </div>
        <div className={styles.confirmationMessage}>
          Please check your email for confirmation link
        </div>
        <a href={'/'} className={styles.signinLink}>
          Sign in
        </a>
        <a href={'/signup'} className={styles.signupLink}>
          Return to Sign up
        </a>
      </div>
    );
  };

  renderSignUpPage = () => {
    return (
      <div className={styles.root}>
        <div className={styles.leftColumn}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
            </div>
            <div className={styles.logoTitle}>
            </div>
          </div>
          <div className={styles.stepsContainer}>
            {this.renderStepLabel(0)}
            {this.renderStepLabel(1)}
            {this.renderStepLabel(2)}
          </div>
        </div>
        <div className={styles.rightColumn} >
          {this.renderSteps()}
        </div>
      </div>
    );
  };

  render() {
    return (this.state.confirmEmail ? this.renderConfirmationEmailPage() : this.renderSignUpPage());
  }
}

export default SignUp;
