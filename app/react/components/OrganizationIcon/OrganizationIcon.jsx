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
  };

  static defaultProps = {
    url: '/',
    style: {},
    reactLink: true,
  };

  render() {
    const { organization, url, style, reactLink } = this.props;
    const { name } = organization;
    if (reactLink) {
      return (
        <Link to={url} className={styles.root} title={name} style={{ ...style }}>
          {name.charAt(0).toUpperCase()}
          {organization.unseenCount > 0 ? <span className={styles.unseenMarker}/> : null}
        </Link>
      );
    }
    return (
      <a href={url} className={styles.root} title={name} style={{ ...style }}>
        {name.charAt(0).toUpperCase()}
        {organization.unseenCount > 0 ? <span className={styles.unseenMarker}/> : null}
      </a>
    );
  }
}

export default OrganizationIcon;
