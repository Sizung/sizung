import React, { PropTypes } from 'react';
import styles from './index.css';

// TODO: Find a way to include those css files here instead of in the asset pipeline
// require('react-datepicker/dist/react-datepicker.css');
import DatePicker from 'react-datepicker';
import moment from 'moment';

class EditableDate extends React.Component {

  static propTypes = {
    editable: PropTypes.bool,
    value: PropTypes.string,
    onUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editable: true,
  };

  handleChange = (newValue) => {
    const value = newValue ? newValue.format('YYYY-MM-DD').toString() : null;
    this.props.onUpdate(value);
  }

  textElement(persistedText, editable) {
    const value = persistedText ? moment(persistedText) : null;
    return <DatePicker selected={value}
                       placeholderText="Due On?"
                       onChange={this.handleChange}
                       dateFormat="DD MMM - YYYY"
                       weekStart="1"
                       disabled={!editable}
                       locale={'en'}
                       weekdays={"S_M_T_W_T_F_S".split("_")}
                       />;
  }

  render() {
    const { value, editable } = this.props;
    return this.textElement(value, editable);
  }
}

export default EditableDate;
