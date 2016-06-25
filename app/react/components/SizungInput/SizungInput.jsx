import React, { PropTypes } from 'react';
import styles from './SizungInput.css';

class SizungInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onSubmit: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    users: PropTypes.object,
    maxLength: PropTypes.number,
  };

  static defaultProps = {
    defaultValue: '',
  };

  constructor(properties) {
    super(properties);

    this.state = {
      value: properties.value ? properties.value : properties.defaultValue,
    };
  }

  componentWillReceiveProps(properties) {
    if (properties.value !== null && properties.value !== undefined) {
      this.setState({ value: properties.value });
    }
  }

  value = () => {
    return this.state.value;
  };

  handleChange = (ev) => {
    const { value } = ev.target;
    if (this.props.maxLength && value && value.length > this.props.maxLength) {
      return null;
    }

    this.setState({
      value,
    });

    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }
  };

  handleKeyDown = (e) => {
    const value = this.state.value;

    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      if (this.props.onSubmit) {
        this.props.onSubmit(value);
      }
    } else if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  handleKeyUp = (e) => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  };

  handleBlur = (e) => {
    if (this.props.onBlur) {
      this.props.onBlur(e, this.state.value);
    }
  };

  userSuggestions = () => {
    const { users } = this.props;
    return users ? users.filter(u => u.display).toJS() : [];
  };

  render() {
    const { placeholder } = this.props;
    return (
      <input type="text"
        value={this.state.value}
        placeholder={placeholder}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onBlur={this.handleBlur}
        className={styles.input}
      />
    );
  }
}

export default SizungInput;
