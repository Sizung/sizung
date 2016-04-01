import React, { PropTypes } from 'react';
import FormInput from '../FormInput';

class TextInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    setUser: PropTypes.func,
    validate: PropTypes.func,
    type: PropTypes.oneOf(['firstName', 'lastName', 'organizationName']),
  };

  static defaultProps = {
    value: null,
  };

  setUserParam = (text) => {
    if (this.props.type === 'firstName') {
      this.props.setUser({ firstName: text });
    } else if (this.props.type === 'lastName') {
      this.props.setUser({ lastName: text });
    } else if (this.props.type === 'organizationName') {
      this.props.setUser({organization: { name: text }});
    }
  };

  render() {
    const { value, type, errorMessage } = this.props;
    let label;
    let placeholder;
    if (type === 'firstName') {
      label = 'FIRST NAME';
      placeholder = '';
    } else if (type === 'lastName') {
      label = 'LAST NAME';
      placeholder = '';
    } else if (type === 'organizationName') {
      label = 'COMPANY/TEAM NAME';
      placeholder = '#';
    }
    return (
      <FormInput label={label} type={'text'} value={value} errorMessage={errorMessage} validate={this.props.validate} onChange={this.setUserParam} placeholder={placeholder}/>
    );
  }
}

export default TextInput;
