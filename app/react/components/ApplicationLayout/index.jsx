import React, { Component, PropTypes } from 'react';
import TopBar from '../TopBar/index.js';
import StaleNotification from '../StaleNotification';
import styles from './index.css';

class ApplicationLayout extends Component {

  constructor() {
    super();
    this.lastYPosition = 0;
  }

  disablePullToRefreshEffect = (e) => {
    const scrollYPosition = this.refs.app.pageYOffset || this.refs.app.scrollTop || 0;
    const direction = e.changedTouches[0].pageY > this.lastYPosition ? 1 : -1;
    if (direction > 0 && scrollYPosition === 0) {
      e.preventDefault();
    }
    this.lastYPosition = e.changedTouches[0].pageY;
  };

  render() {
    const { currentUser, organizations, currentOrganization, currentConversation } = this.props;

    return (
      <div ref='app' className={styles.root} onTouchMove={this.disablePullToRefreshEffect}>
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
