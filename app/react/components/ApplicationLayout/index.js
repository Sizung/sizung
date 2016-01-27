import React, { Component, PropTypes } from 'react';
import NavigationHeader from './../NavigationHeader/index';
import StaleNotification from '../StaleNotification';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class ApplicationLayout extends Component {
  render() {
    const { currentUser, organizations, currentOrganization, currentConversation } = this.props;

    return (
      <div styleName="root">
        <NavigationHeader
          currentUser={currentUser}
          organizations={organizations}
          currentOrganization={currentOrganization}
          currentConversation={currentConversation}
        />
        <div styleName="main-content" >
          <StaleNotification />
          { this.props.children }
        </div>
        <footer styleName="footer">
          &copy; Sizung 2016
        </footer>
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