import React, { Component, PropTypes } from 'react';
import NavigationHeader from './../NavigationHeader/index';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class ApplicationLayout extends Component {
  render() {
    const { organizations } = this.props;

    return (
      <div styleName='root'>
        <NavigationHeader currentUser={this.props.currentUser} organizations={organizations}/>
        <div styleName='main-content' >
          { this.props.children }
        </div>
        <footer styleName='footer'>
          &copy; Sizung 2015
        </footer>
      </div>
    );
  }
}

ApplicationLayout.propTypes = {
  organizations: PropTypes.object.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default ApplicationLayout;