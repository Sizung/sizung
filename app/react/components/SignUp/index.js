import React from 'react';
import SignUpInformation from '../SignUpInformation';
import SignUpCredentials from '../SignUpCredentials';

class SignUp extends React.Component {

  constructor() {
    super();
    this.state = {
      currentStage: 'credentials',
      user: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirmation: '',
      },
    };
  }

  setCurrentStage = (newState) => {
    this.setState({
      currentStage: newState,
    });
  };

  setUser = (user) => {
    console.log("Setting user: " + JSON.stringify(user) + ", email? " + (user.email));
    this.setState({
      user: {
        email: ((user.email !== undefined && user.email !== null) ? user.email : this.state.user.email),
        firstName: ((user.firstName !== undefined && user.firstName !== null) ? user.firstName : this.state.user.firstName),
        lastName: ((user.lastName !== undefined && user.lastName !== null) ? user.lastName : this.state.user.lastName),
        password: ((user.password !== undefined && user.password !== null) ? user.password : this.state.user.password),
        passwordConfirmation: ((user.passwordConfirmation !== undefined && user.passwordConfirmation !== null) ? user.passwordConfirmation : this.state.user.passwordConfirmation),
      },
    });
  };

  render() {
    if (this.state.currentStage === 'information') {
      return (
      <SignUpInformation setCurrentStage={this.setCurrentStage} user={this.state.user} setUser={this.setUser}/>
      );
    }
    return (<SignUpCredentials setCurrentStage={this.setCurrentStage} user={this.state.user} setUser={this.setUser}/>);
  }
}

export default SignUp;
