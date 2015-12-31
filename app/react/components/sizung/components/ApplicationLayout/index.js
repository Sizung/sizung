import React, { Component, PropTypes } from 'react';
import NavigationHeader from './../NavigationHeader/index';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class ApplicationLayout extends Component {
  render() {
    const { organizations, currentOrganization, currentConversation, users } = this.props;

    return (
      <div styleName='root'>
        <NavigationHeader currentUser={this.props.currentUser} organizations={organizations} currentOrganization={currentOrganization} currentConversation={currentConversation} users={users}/>
        <div styleName='main-content' >
          { this.props.children }
        </div>
        <footer styleName='footer'>
          &copy; Sizung 2016
        </footer>
      </div>
    );
  }
}

ApplicationLayout.propTypes = {
  currentOrganization: PropTypes.object.isRequired,
  currentConversation: PropTypes.object.isRequired,
  organizations: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  users: PropTypes.object.isRequired
};

export default ApplicationLayout;