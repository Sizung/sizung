import React, { PropTypes } from 'react';
import styles from './TopBar.css';
import OrganizationIcon from '../OrganizationIcon/index';
import ProfileDropdown from '../ProfileDropdown/index';

class TopBar extends React.Component {

  static propTypes = {
    currentOrganization: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    organizations: PropTypes.object.isRequired,
    currentUser: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
  };

  renderOrganizationList = () => {
    const { organizations, currentOrganization } = this.props;

    return organizations.filter(org => org.id !== currentOrganization.id).map((org) => {
      return <OrganizationIcon key={org.id} name={org.name} url={'/organizations/' + org.id} style={{ marginLeft: '24px' }} />;
    });
  };

  renderOrganizationPart = () => {
    const { currentOrganization } = this.props;

    if (currentOrganization) {
      return (
        <div className={styles.organizationWrapper}>
          <OrganizationIcon name={currentOrganization.name} url={'/organizations/' + currentOrganization.id} />
          <div className={styles.otherOrganizations}>
            {this.renderOrganizationList()}
            <OrganizationIcon name="+ New Organization" url="/organizations/new" reactLink={false} style={{ marginLeft: '48px' }} />
          </div>
        </div>
      );
    }
  };

  render() {
    const { currentUser } = this.props;

    return (
      <div className={styles.root}>
        {this.renderOrganizationPart()}
        <div className={styles.profileDropdown}>
          <ProfileDropdown currentUser={currentUser} />
        </div>
      </div>
    );
  }
}

export default TopBar;