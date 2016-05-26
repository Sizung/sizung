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
    currentConversation: PropTypes.object,
  };

  static defaultProps = {
    reactLinks: true,
  };

  otherOrganizationsUnseenCount = () => {
    const { organizations, currentOrganization } = this.props;
    let count = 0;
    organizations.filter((org) => {
      return org.id !== currentOrganization.id;
    }).map((otherOrganization) => {
      count += otherOrganization.unseenCount;
    });
    return count;
  };

  renderOrganizationList = () => {
    const { organizations, currentOrganization, reactLinks } = this.props;

    return organizations.filter(org => org.id !== currentOrganization.id).map((org) => {
      return <OrganizationIcon key={org.id} reactLink={reactLinks} organization={org} url={'/organizations/' + org.id} showUnseenNotification style={{ marginLeft: '2rem' }}/>;
    });
  };

  renderUnseenNotification = () => {
    if (this.otherOrganizationsUnseenCount() > 0) {
      return <div className={styles.notification}/>;
    }
    return null;
  };

  renderOrganizationPart = () => {
    const { currentOrganization, reactLinks } = this.props;
    if (currentOrganization) {
      return (
        <div className={styles.organizationWrapper}>
          {this.renderUnseenNotification()}
          <OrganizationIcon organization={currentOrganization} reactLink={reactLinks} url={'/organizations/' + currentOrganization.id}/>
          <div className={styles.otherOrganizations}>
            {this.renderOrganizationList()}
            <a href={'/organizations/new'} title={'+ New Organization'} style={{ marginLeft: '3rem' }}>
              <PlusIcon/>
            </a>
          </div>
        </div>
      );
    }
  };

  render() {
    const { currentUser, currentOrganization, currentConversation } = this.props;
    return (
      <div className={ currentConversation === null ? styles.root : styles.rootHiddenOnMobile}>
        {this.renderOrganizationPart()}
        <div className={styles.profileDropdown}>
          <ProfileDropdown currentUser={currentUser} currentOrganization={currentOrganization}/>
        </div>
      </div>
    );
  }
}

export default TopBar;
