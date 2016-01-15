import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class Organization extends React.Component {

  actions = (organization) => {
    if (organization.editable) {
      return (
        <div styleName="actions">
          <small>
            <a href={'/organizations/' + organization.id + '/edit'} styleName="action">
              <i className="fa fa-pencil" /> edit
            </a>
            <a href={'/organizations/' + organization.id + '/organization_members'} styleName="action">
              <i className="fa fa-users" /> members
            </a>
          </small>
        </div>
      );
    }
  };

  render() {
    const { organization } = this.props;
    return (
      <h3 styleName="root">
        { organization.name }
        { this.actions(organization) }
      </h3>
    );
  }
}

Organization.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    editable: PropTypes.string.isRequired,
  }).isRequired,
};

export default Organization;
