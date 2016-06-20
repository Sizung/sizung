import React, { Component, PropTypes } from 'react';
import TopBar from '../TopBar/index.js';
import StaleNotification from '../StaleNotification';
import styles from './index.css';

class ApplicationLayout extends Component {

  _handleKeyDown = (event) => {
    if (event.which === 8 || event.which === 46) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  render() {
    const { currentUser, organizations, currentOrganization, currentConversation } = this.props;

    return (
      <div className={styles.root} onKeyDown={this._handleKeyDown} tabIndex="1">
        <TopBar currentUser={currentUser} organizations={organizations} currentOrganization={currentOrganization} currentConversation={currentConversation}/>
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
