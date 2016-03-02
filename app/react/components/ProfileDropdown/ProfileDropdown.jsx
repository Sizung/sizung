import React, { PropTypes } from 'react';
import styles from './ProfileDropdown.css';

class ProfileDropdown extends React.Component {
  constructor() {
    super();
    this.state = { open: false };
  }

  static propTypes = {
    currentUser: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {};

  handleOpenClick = () => {
    this.setState({ open: true });
  };

  handleCloseClick = () => {
    this.setState({ open: false });
  };

  renderOpen = () => {
    const { name } = this.props.currentUser;

    return (
      <div className={styles.rootOpen}>
        <div className={styles.header} onClick={this.handleCloseClick}>
          <div className={styles.round} title={name} >
            {name.charAt(0)}
          </div>
          <div className={styles.name}>
            {name}
          </div>
          <div className={styles.caretOpen}></div>
        </div>
        <div className={styles.menu}>
          <a href="/users/edit">Settings</a>
          <a href="/users/sign_out" data-method="delete">Sign Out</a>
        </div>
      </div>
    );
  };

  renderShow = () => {
    const { name } = this.props.currentUser;

    return (
      <div className={styles.rootShow} onClick={this.handleOpenClick}>
        <div className={styles.round} title={name} >
          {name.charAt(0)}
        </div>
        <div className={styles.caretClosed}></div>
      </div>
    );
  };

  render() {
    return this.state.open ? this.renderOpen() : this.renderShow();
  }
}

export default ProfileDropdown;
