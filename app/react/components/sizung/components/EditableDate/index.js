import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

//TODO: Find a way to include those css files here instead of in the asset pipeline
//require('react-datepicker/dist/react-datepicker.css');
import DatePicker from 'react-datepicker';
import moment from 'moment';

@CSSModules(styles)
class EditableDate extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(newValue) {
    newValue = newValue ? newValue.format('YYYY-MM-DD').toString() : null;
    this.props.onUpdate(newValue);
  }

  textElement(persistedText) {
    var value = persistedText ? moment(persistedText) : null;
    return <DatePicker selected={value} placeholderText="When is it due?" onChange={this.handleChange} dateFormat="YYYY-MM-DD" weekStart='0'/>;
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