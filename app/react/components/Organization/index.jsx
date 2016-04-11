import React, { PropTypes } from 'react';
import styles from './index.css';

class Organization extends React.Component {

  actions = (organization) => {
    if (organization.editable) {
      return (
        <div className={styles.actions}>
          <small>
            <a href={'/organizations/' + organization.id + '/edit'} className={styles.action}>
              <i className="fa fa-pencil" /> edit
            </a>
            <a href={'/organizations/' + organization.id + '/organization_members'} className={styles.action}>
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
      <h3 className={styles.root}>
        { organization.name }
        { this.actions(organization) }
      </h3>
    );
  }
}

Organization.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    editable: PropTypes.bool,
  }).isRequired,
};

export default Organization;
