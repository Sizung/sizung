import React, { PropTypes } from 'react';
import styles from './Activities.css';

class Activities extends React.Component {

  static propTypes = {
    currentOrganization: PropTypes.object.isRequired,
  };

  render() {
    if (this.props.currentOrganization) {
      return (<div className={styles.root}>{ 'Awesome Activities stream for ' + this.props.currentOrganization.name }</div>);
    }
    return null;
  }
}

export default Activities;
