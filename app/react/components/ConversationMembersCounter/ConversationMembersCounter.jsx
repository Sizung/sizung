import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './ConversationMembersCounter.css';
import Immutable from 'immutable';
import UserIcon from '../UserIcon';

class ConversationMembersCounter extends React.Component {

  handleToggleView = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render = () => {
    const usersCount = this.props.conversationMembers ? this.props.conversationMembers.toList().size : 0;
    return (
      <span className={styles.memberDropdownContainer}>
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
};

export default ConversationMembersCounter;
