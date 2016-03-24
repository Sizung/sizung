import React, { PropTypes } from 'react';
import FormInput from '../FormInput';

class EmailInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    setUser: PropTypes.func,
    validate: PropTypes.func,
    errorMessage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    valid: null,
  };

  setUserEmail = (email) => {
    this.props.setUser({ email });
  };

  render() {
    const { value, errorMessage } = this.props;
    return (
      <FormInput label='EMAIL ADDRESS' type='email' value={value} errorMessage={errorMessage} validate={this.props.validate} onChange={this.setUserEmail} placeholder='eg: username@domain.com' tabIndex={'1'}/>
    );
  }
}

export default EmailInput;
