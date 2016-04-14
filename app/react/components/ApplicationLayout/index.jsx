import React, { Component, PropTypes } from 'react';
import TopBar from '../TopBar/index.js';
import StaleNotification from '../StaleNotification';
import styles from './index.css';

class ApplicationLayout extends Component {
  render() {
    const { currentUser, organizations, currentOrganization } = this.props;

    return (
      <div className={styles.root}>
        <TopBar currentUser={currentUser} organizations={organizations} currentOrganization={currentOrganization} />
        <div className={styles.mainContent} >
          <StaleNotification />
          { this.props.children }
        </div>
      </div>
    );
  }
}

ApplicationLayout.propTypes = {
  currentOrganization: PropTypes.object,
  currentConversation: PropTypes.object,
  organizations: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ApplicationLayout;
