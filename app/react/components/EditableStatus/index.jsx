import React, { Component, PropTypes } from 'react';
import styles from "./index.css";

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
      <span className={styles["root-" + (editable ? 'editable-' : '') + status]} onClick={editable ? this.handleStatusClick : null}>
        <span className={styles.stack}>
          <i className={styles.circle} />
          <i className={styles.status} />
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
