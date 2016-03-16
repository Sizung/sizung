import React, { PropTypes } from 'react';
import styles from './ConversationMembersCounter.css';
import UserIcon from '../UserIcon';

class ConversationMembersCounter extends React.Component {

  handleToggleView = () => {
    this.props.showConversationMembers(!this.props.conversationMembersViewVisible);
  };

  render = () => {
    const usersCount = this.props.conversationMembers ? this.props.conversationMembers.toList().size : 0;
    return (
      <span className={styles.memberDropdownContainer} onClick={this.handleToggleView}>
          <div aria-haspopup="true" aria-expanded="false">
            <UserIcon inverted size={'x-large'} style={{ paddingTop: '15px' }} />
            <div className={styles.memberBadge}>{usersCount}</div>
          </div>
      </span>
    );
  };
}

ConversationMembersCounter.propTypes = {
  conversationMembers: PropTypes.object,
  showConversationMembers: PropTypes.func,
  conversationMembersViewVisible: PropTypes.bool.isRequired,
};

export default ConversationMembersCounter;
