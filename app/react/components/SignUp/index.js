import React from 'react';
import SignUpInformation from '../SignUpInformation';
import SignUpCredentials from '../SignUpCredentials';
import SignUpTeam from '../SignUpTeam';
import styles from './index.css';

class SignUp extends React.Component {

  constructor() {
    super();
    this.state = {
      currentStage: 0,
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
    };
  }

  setCurrentStage = (newState) => {
    this.setState({
      currentStage: newState,
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
    });
  };

  renderSteps = () => {
    if (this.state.currentStage === 0) {
      return (<SignUpCredentials setCurrentStage={this.setCurrentStage} user={this.state.user} setUser={this.setUser}/>);
    } else if (this.state.currentStage === 1) {
      return (<SignUpInformation setCurrentStage={this.setCurrentStage} user={this.state.user} setUser={this.setUser}/>);
    } else if (this.state.currentStage === 2) {
      return (<SignUpTeam setCurrentStage={this.setCurrentStage} user={this.state.user} setUser={this.setUser}/>);
    }
  };

  getStepLabelStyle = (stage) => {
    if (stage < this.state.currentStage) {
      return styles.previousStage;
    } else if (stage === this.state.currentStage) {
      return styles.currentStage;
    }
    return styles.stage;
  };

  renderStepLabel = (stage) => {
    let stepLabel = '';
    const stepLabelStyle = this.getStepLabelStyle(stage);
    if (stage === 0) {
      stepLabel = 'Credentials';
    } else if (stage === 1) {
      stepLabel = 'Information';
    } else if (stage === 2) {
      stepLabel = 'Pick a Team';
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

  render() {
    console.log("User State: " + JSON.stringify(this.state.user));
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
  }
}

export default SignUp;
