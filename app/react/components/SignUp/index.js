import React from 'react';
import SignUpInformation from '../SignUpInformation';
import SignUpCredentials from '../SignUpCredentials';

class SignUp extends React.Component {

  constructor() {
    super();
    this.state = {
      currentStage: 'credentials',
    };
  }

  updateState = (newState) => {
    this.setState({
      currentStage: newState,
    });
  };

  render() {
    if (this.state.currentStage === 'information') {
      return (
      <SignUpInformation updateState={this.updateState}/>
      );
    }
    return (<SignUpCredentials updateState={this.updateState}/>);
  }
}

export default SignUp;
