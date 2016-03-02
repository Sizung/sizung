import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './OrganizationIcon.css';

class OrganizationIcon extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
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
    const { name, url, style, reactLink } = this.props;
    if (reactLink) {
      return (
        <Link to={url} className={styles.root} title={name} style={{ ...style }}>
          {name.charAt(0)}
        </Link>
      );
    }
    return (
      <a href={url} className={styles.root} title={name} style={{ ...style }}>
        {name.charAt(0)}
      </a>
    );
  }
}

export default OrganizationIcon;
