import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './OrganizationIcon.css';

class OrganizationIcon extends React.Component {

  static propTypes = {
    organization: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      unseenCount: PropTypes.number.isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
    style: PropTypes.object,
    reactLink: PropTypes.bool.isRequired,
    showUnseenNotification: PropTypes.bool,
  };

  static defaultProps = {
    url: '/',
    style: {},
    reactLink: true,
    showUnseenNotification: false,
  };

  renderUnseenNotification = () => {
    const { showUnseenNotification, organization } = this.props;
    if (showUnseenNotification && organization.unseenCount > 0) {
      return  <span className={styles.unseenMarker}/>;
    }
    return null;
  };

  render() {
    const { organization, url, style, reactLink, showUnseenNotification } = this.props;
    const { name } = organization;
    if (reactLink) {
      return (
        <Link to={url} className={styles.root} title={name} style={{ ...style }}>
          {name.charAt(0).toUpperCase()}
          { this.renderUnseenNotification() }
        </Link>
      );
    }
    return (
      <a href={url} className={styles.root} title={name} style={{ ...style }}>
        {name.charAt(0).toUpperCase()}
        { this.renderUnseenNotification() }
      </a>
    );
  }
}

export default OrganizationIcon;
