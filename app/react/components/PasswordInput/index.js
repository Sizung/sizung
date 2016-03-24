import React, { PropTypes } from 'react';
import FormInput from '../FormInput';

class PasswordInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    setUser: PropTypes.func,
    validate: PropTypes.func,
    type: PropTypes.oneOf(['password', 'passwordConfirmation']),
  };

  static defaultProps = {
    value: null,
  };

  setUserPassword = (password) => {
    if (this.props.type === 'password') {
      this.props.setUser({ password });
    } else {
      this.props.setUser({ passwordConfirmation: password });
    }
  };

  render() {
    const { value, type, errorMessage } = this.props;
    let label;
    let placeholder;
    if (type === 'password') {
      label = 'PASSWORD';
      placeholder = 'min 8 character password';
    } else {
      label = 'CONFIRM PASSWORD';
      placeholder = '';
    }
    return (
      <FormInput label={label} type={'password'} value={value} errorMessage={errorMessage} validate={this.props.validate} onChange={this.setUserPassword} placeholder={placeholder}/>
    );
  }
}

export default PasswordInput;
