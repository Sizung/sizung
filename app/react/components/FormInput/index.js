import React, { PropTypes } from 'react';
import styles from './index.css';

class FormInput extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    tabIndex: PropTypes.string,
    errorMessage: PropTypes.string,
    autoFocus: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    validate: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    valid: true,
    placeholder: '',
    errorMessage: null,
    required: false,
    value: null,
    disabled: false,
  };

  constructor() {
    super();
  }

  renderErrorMessage = (message) => {
    return (
      <div className={styles.formInputMessage}>
        {message}
      </div>
    );
  };

  onChange = () => {
    this.props.onChange( this.refs.input.value ? this.refs.input.value : '');
  };

  handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.props.onSubmit();
    } else if (event.key === 'Escape') {
      this.refs.input.value = '';
      this.props.onCancel();
    }
  };

  render() {
    const { label, type, placeholder, tabIndex, autoFocus, value, errorMessage, disabled } = this.props;
    return (
      <div className={styles.formInputContainer}>
        <div className={ (errorMessage === null || errorMessage.trim() === '') ? styles.formInput : styles.formInputError }>
          <div className={styles.formInputLabel}>
            {label}
          </div>
          <div className={styles.formInputValue}>
            <input ref='input' value={value} type={type} placeholder={placeholder} tab-index={tabIndex} onBlur={this.props.validate} onChange={this.onChange} onKeyDown={this.handleKeyDown} autoFocus={autoFocus} disabled={disabled}/>
          </div>
        </div>
        { (errorMessage === null || errorMessage.trim() === '') ? '' : this.renderErrorMessage(errorMessage)}
      </div>
    );
  }
}

export default FormInput;
