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

  textElement(persistedText, editable) {
    var value = persistedText ? moment(persistedText) : null;
    return <DatePicker selected={value}
                       placeholderText="Due On?"
                       onChange={this.handleChange}
                       dateFormat="DD MMM - YYYY"
                       weekStart='1'
                       disabled={!editable}
                       locale={'en'}
                       weekdays={"S_M_T_W_T_F_S".split("_")}
                       />;
  }

  render() {
    const {value, editable} = this.props;
    return this.textElement(value, editable);
  }
}

EditableDate.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.string,
  onUpdate: PropTypes.func.isRequired
};

EditableDate.defaultProps = {
  editable: true
};

export default EditableDate;