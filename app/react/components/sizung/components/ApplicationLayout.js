import React, { Component, PropTypes } from 'react';
import NavigationHeader from './NavigationHeader';

class ApplicationLayout extends Component {
  render() {
    return (
      <div>
        <NavigationHeader currentUser={this.props.currentUser}/>
        <div className="container gray-bg padding-lg full-width">
          <div className="row">
            <div className="col-lg-12">
              { this.props.children }
            </div>
          </div>
          <footer>
            <p>&copy; Sizung 2015</p>
          </footer>
        </div>
      </div>
    );
  }
}

ApplicationLayout.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default ApplicationLayout;