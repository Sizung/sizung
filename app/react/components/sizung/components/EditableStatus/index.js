import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class EditableStatus extends React.Component {
  constructor() {
    super();

    this.handleStatusClick = this.handleStatusClick.bind(this);
  }

  handleStatusClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const newStatus = this.props.status === 'open' ? 'resolved' : 'open';
    this.props.onUpdate(newStatus);
  }

  render() {
    const styleName = 'status-' + this.props.status;
    return <span><i styleName={styleName} onClick={this.handleStatusClick}/></span>;
  }
}

EditableStatus.propTypes = {
  status: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditableStatus;