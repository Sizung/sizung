import React, { Component, PropTypes } from 'react';
import TopBar from '../TopBar/index.js';
import StaleNotification from '../StaleNotification';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class ApplicationLayout extends Component {
  render() {
    const { currentUser, organizations, currentOrganization } = this.props;

    return (
      <div styleName="root">
        <TopBar currentUser={currentUser} organizations={organizations} currentOrganization={currentOrganization} />
        <div styleName="main-content" >
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
