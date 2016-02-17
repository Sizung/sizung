import React, { Component, PropTypes } from 'react';
import styles from './index.css';
import User from '../User/index';

class SelectableUser extends React.Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    this.props.onUpdate(this.props.user.id);
  }

  render() {
    const { user, isSelected } = this.props;
    return (
        <div onClick={this.handleSelect} className={styles.root}>
          <div className={styles.status}>
            <i className={isSelected ? styles.selected : styles.unselected}></i>
          </div>
          <div className={styles.userContainer}>
            <User key={user.id} user={user} showName showEmail />
          </div>
        </div>
    );
  }
}

SelectableUser.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    presenceStatus: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SelectableUser;
