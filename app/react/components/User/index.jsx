import React, { PropTypes } from 'react';
import styles from './index.css';

class User extends React.Component {

  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      presenceStatus: PropTypes.string.isRequired,
    }).isRequired,
    currentUser: PropTypes.shape({
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      presenceStatus: PropTypes.string.isRequired,
    }),
    size: PropTypes.oneOf(['normal', 'large', 'small']).isRequired,
    showName: PropTypes.bool,
    showEmail: PropTypes.bool,
    style: PropTypes.object,
    innerStyle: PropTypes.object,
  };

  static defaultProps = {
    user: {
      email: 'sizung@example.com',
      firstName: '?',
      lastName: '?',
      presenceStatus: 'offline',
    },
    size: 'normal',
    showName: false,
    showEmail: false,
    style: {},
    innerStyle: {},
  };

  constructor() {
    super();
    this.validSizes = ['normal', 'large', 'small'];
  }

  render() {
    const { style, showName, showEmail, innerStyle, currentUser } = this.props;
    const { id, email, presenceStatus, firstName, lastName } = this.props.user;
    const initials = (firstName && lastName) ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();
    const onlineState = (presenceStatus === 'online' || id === currentUser.id) ? '-online' : '';
    const size = (this.validSizes.indexOf(this.props.size) === -1) ? this.validSizes[0] : this.props.size;
    let name;
    if (showName) {
      if (firstName && lastName) {
        name = <span className={styles.name}>{firstName + ' ' + lastName}</span>;
      } else {
        name =  <span className={styles.name}>{email}</span>;
      }
    } else {
      name = '';
    }
    const userEmail = showEmail ? <span className={styles.email}><small>({email})</small></span> : '';

    return (
        <div className={styles.root} title={email} style={style}>
          <div className={styles['circle-badge-' + size + onlineState]} style={innerStyle}>
            {initials}
          </div>
          {
            (showName ?
              <div className={styles['user-title-' + size]} >
                {name}
                {userEmail}
              </div>
              :
              ''
            )
          }
        </div>
    );
  }
}

export default User;
