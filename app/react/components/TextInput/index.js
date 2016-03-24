import React, { PropTypes } from 'react';
import FormInput from '../FormInput';

class TextInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    setUser: PropTypes.func,
    validate: PropTypes.func,
    type: PropTypes.oneOf(['firstName', 'lastName']),
  };

  static defaultProps = {
    value: null,
  };

  setUserName = (text) => {
    if (this.props.type === 'firstName') {
      this.props.setUser({ firstName: text });
    } else if (this.props.type === 'lastName') {
      this.props.setUser({ lastName: text });
    }
  };

  render() {
    const { value, type, errorMessage } = this.props;
    let label;
    let placeholder;
    if (type === 'firstName') {
      label = 'FIRST NAME';
      placeholder = '';
    } else {
      label = 'LAST NAME';
      placeholder = '';
    }
    return (
      <FormInput label={label} type={'text'} value={value} errorMessage={errorMessage} validate={this.props.validate} onChange={this.setUserName} placeholder={placeholder}/>
    );
  }
}

export default TextInput;
