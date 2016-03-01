import React, { PropTypes } from 'react';
import { Link } from 'react-router';
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
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  handleOpenClick = () => {
    this.setState({ open: true });
  };

  handleCloseClick = () => {
    this.setState({ open: false });
  };

  renderOpen = () => {
    const { currentUser, style } = this.props;
    const { name } = currentUser;

    return (
      <div className={styles.rootOpen}>
        <div className={styles.header} onClick={this.handleCloseClick}>
          <div className={styles.round} title={name} style={{ ...style }} >
            {name.charAt(0)}
          </div>
          <div className={styles.name}>
            {name}
          </div>
        </div>
        <div className={styles.menu}>
          <Link url="/">Settings</Link>
          <Link url="/">Log out</Link>
        </div>
      </div>
    );
  };

  renderShow = () => {
    const { currentUser, style } = this.props;
    const { name } = currentUser;

    return (
      <div className={styles.rootShow}>
        <div className={styles.round} title={name} style={{ ...style }} onClick={this.handleOpenClick}>
          {name.charAt(0)}
        </div>
      </div>
    );
  };

  render() {
    return this.state.open ? this.renderOpen() : this.renderShow();
  }
}

export default ProfileDropdown;
