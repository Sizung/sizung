import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

//TODO: Find a way to include those css files here instead of in the asset pipeline
//import datePickerStyles from '../../../../../../node_modules/react-date-picker/index.css';
//require('react-date-picker/base.css');
//require('react-date-picker/theme/hackerone.css');
import DatePicker from 'react-date-picker';

@CSSModules(styles)
class EditableDate extends React.Component {
  constructor() {
    super();
    this.state = {edit: false};

    this.handleChange     = this.handleChange.bind(this);
    this.handleEditClick  = this.handleEditClick.bind(this);
  }

  handleChange(newValue) {
    this.props.onUpdate(newValue);
    this.setState({edit: false})
  }

  handleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({edit: true})
  }

  toDateString(value, nullString = null) {
    if (value === null) {
      return nullString;
    }
    else {
      return value;
    }
  }

  textElement(persistedText) {
    if (this.state.edit) {
      var value = this.toDateString(persistedText);
      return <DatePicker date={value} onChange={this.handleChange} />;
    }
    else {
      var value = this.toDateString(persistedText, 'no date');
      return <div styleName='persisted-text-container'>{value}<a styleName="edit-link" href="#" onClick={this.handleEditClick}><i className="fa fa-pencil" style={{marginLeft: '1em'}} /></a></div>;
    }
  }

  render() {
    return this.textElement(this.props.value);
  }
}

EditableDate.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditableDate;