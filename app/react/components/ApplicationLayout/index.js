import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import NavigationHeader from './../NavigationHeader/index';
import StaleNotification from '../StaleNotification';
import Toasts from '../Toasts';
import * as styles from './index.css';

class ApplicationLayout extends Component {
  render() {
    const { currentUser, organizations, currentOrganization, currentConversation, toasts } = this.props;

    return (
      <div className={ styles.root }>
        <NavigationHeader
          currentUser={currentUser}
          organizations={organizations}
          currentOrganization={currentOrganization}
          currentConversation={currentConversation}
        />
        <div className={ styles.mainContent } >
          <StaleNotification />
          { this.props.children }
          <Toasts toasts={toasts} />
        </div>
        <footer className={ styles.footer }>
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
  toasts: PropTypes.object,
};

ApplicationLayout.defaultProps = {
  toasts: new Immutable.List(),
};

export default ApplicationLayout;