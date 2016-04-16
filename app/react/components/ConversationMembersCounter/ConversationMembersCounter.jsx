import React, { PropTypes } from 'react';
import styles from './ConversationMembersCounter.css';
import UserIcon from '../UserIcon';

class ConversationMembersCounter extends React.Component {

  handleToggleView = () => {
    this.props.setConversationSettingsState('edit');
  };

  render = () => {
    const usersCount = this.props.conversationMembers ? this.props.conversationMembers.toList().size : 0;
    return (
      <span className={styles.memberDropdownContainer} onClick={this.handleToggleView}>
        <UserIcon/>
        <div className={styles.memberBadge}>{usersCount}</div>
      </span>
    );
  };
}

ConversationMembersCounter.propTypes = {
  conversationMembers: PropTypes.object,
  setConversationSettingsState: PropTypes.func,
};

export default ConversationMembersCounter;
