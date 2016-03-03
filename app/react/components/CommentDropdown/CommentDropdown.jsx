import React, { PropTypes } from 'react';
import styles from './CommentDropdown.css';

class CommentDropdown extends React.Component {
  static propTypes = {
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
  }

  constructor() {
    super();
    this.state = { edit: false };
  }

  handleGearClick = () => {
    this.setState({ edit: !this.state.edit });
  }

  renderGearIcon = () => {
    return <div className={styles.gearIcon} onClick={this.handleGearClick}></div>;
  }

  renderEdit = () => {
    const { onEditClick, onDeleteClick } = this.props;

    return (
      <div className={styles.editContainer}>
        <ul className={styles.list}>
          <li className={styles.item} onClick={onEditClick}>Edit Comment</li>
          <li className={styles.item} onClick={onDeleteClick}>Delete Comment</li>
        </ul>
        {this.renderGearIcon()}
      </div>
    );
  }

  renderShow = () => {
    return this.renderGearIcon();
  };

  render() {
    return this.state.edit ? this.renderEdit() : this.renderShow();
  }
}

export default CommentDropdown;
