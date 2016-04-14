import React, { PropTypes } from 'react';
import styles from './TopBar.css';
import OrganizationIcon from '../OrganizationIcon/index';
import ProfileDropdown from '../ProfileDropdown/index';
import PlusIcon from '../PlusIcon';

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
    reactLinks: PropTypes.bool,
  };

  static defaultProps = {
    reactLinks: true,
  };

  renderOrganizationList = () => {
    const { organizations, currentOrganization, reactLinks } = this.props;

    return organizations.filter(org => org.id !== currentOrganization.id).map((org) => {
      return <OrganizationIcon key={org.id} reactLink={reactLinks} name={org.name} url={'/organizations/' + org.id} style={{ marginLeft: '24px' }} />;
    });
  };

  renderOrganizationPart = () => {
    const { currentOrganization, reactLinks } = this.props;
    if (currentOrganization) {
      return (
        <div className={styles.organizationWrapper}>
          <OrganizationIcon name={currentOrganization.name} reactLink={reactLinks} url={'/organizations/' + currentOrganization.id} />
          <div className={styles.otherOrganizations}>
            {this.renderOrganizationList()}
            <a href={'/organizations/new'} title={'+ New Organization'} style={{ marginLeft: '48px' }}>
              <PlusIcon/>
            </a>
          </div>
        </div>
      );
    }
  };

  render() {
    const { currentUser, currentOrganization } = this.props;
    return (
      <div className={styles.root}>
        {this.renderOrganizationPart()}
        <div className={styles.profileDropdown}>
          <ProfileDropdown currentUser={currentUser} currentOrganization={currentOrganization}/>
        </div>
      </div>
    );
  }
}

export default TopBar;
