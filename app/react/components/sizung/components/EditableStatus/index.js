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
    const { status, editable } = this.props;
    return (
      <span styleName={"root-" + (editable ? 'editable-' : '') + status} onClick={editable ? this.handleStatusClick : null}>
        <span styleName="stack">
          <i styleName="circle"/>
          <i styleName="status"/>
        </span>
      </span>
    );
  }
}

EditableStatus.propTypes = {
  status: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  editable: PropTypes.bool
};

EditableStatus.defaultProps = {
  editable: true
};

export default EditableStatus;