import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './OrganizationIcon.css';

class OrganizationIcon extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    url: '/',
    style: {},
  };

  render() {
    const { name, url, style } = this.props;
    return (
      <Link to={url} className={styles.root} title={name} style={{ ...style }}>
        {name.charAt(0)}
      </Link>
    );
  }
}

export default OrganizationIcon;
