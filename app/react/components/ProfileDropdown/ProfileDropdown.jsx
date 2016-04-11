import React, { PropTypes } from 'react';
import styles from './ProfileDropdown.css';

class ProfileDropdown extends React.Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {};

  renderOpen = () => {
    const { name } = this.props.currentUser;

    return (
      <div className={styles.rootOpen}>
        <div className={styles.header}>
          <div className={styles.round} title={name} >
            {name.charAt(0)}
          </div>
          <div className={styles.name}>
            {name}
          </div>
          <div className={styles.caretOpen}></div>
        </div>
        <div className={styles.menu}>
          <a href="/users/settings">Settings</a>
          <a href="/users/sign_out" data-method="delete">Sign Out</a>
        </div>
      </div>
    );
  };

  render() {
    const { name } = this.props.currentUser;

    return (
      <div className={styles.hoverContainer}>
        <div className={styles.rootShow}>
          <div className={styles.round} title={name} >
            {name.charAt(0)}
          </div>
          <div className={styles.caretClosed}></div>
        </div>
        {this.renderOpen()}
      </div>
    );
  }
}

export default ProfileDropdown;
