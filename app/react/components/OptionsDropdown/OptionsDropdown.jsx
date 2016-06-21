import React, { PropTypes } from 'react';
import styles from './OptionsDropdown.css';

class OptionsDropdown extends React.Component {
  static propTypes = {
    options: PropTypes.array,
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
    const { options } = this.props;

    return (
      <div className={styles.editContainer}>
        <ul className={styles.list}>
        {
          options.map((option) => {
            return <li className={styles.item} onClick={option.function}>{option.label}</li>;
          })
        }
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

export default OptionsDropdown;
