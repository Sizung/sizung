import React, { PropTypes } from 'react';
import styles from './TopBar.css';
import OrganizationIcon from '../OrganizationIcon/index';
import ProfileDropdown from '../ProfileDropdown/index';
import PlusIcon from '../PlusIcon';
import OrganizationDropdown from '../OrganizationDropdown';

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

  render() {
    const { currentUser, currentOrganization, currentConversation } = this.props;
    return (
      <div className={ currentConversation === null ? styles.root : styles.rootHiddenOnMobile}>
        { currentOrganization ? <OrganizationDropdown {...this.props}/> : undefined }
        <div className={styles.profileDropdown}>
          <ProfileDropdown currentUser={currentUser} currentOrganization={currentOrganization}/>
        </div>
      </div>
    );
  }
}

export default TopBar;
