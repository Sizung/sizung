import React, { PropTypes } from 'react';
import styles from './ConversationHeader.css';
import ChatIcon from '../ChatIcon';
import UserIcon from '../UserIcon';

class ConversationHeader extends React.Component {
  render() {
    const { onToggleConversationMembersView, usersCount } = this.props;

    let chatType = this.props.chatType;
    if (chatType !== null) {
      if (chatType === 'agendaItems') {
        chatType = '( Agenda Item )';
      } else if (chatType === 'deliverables') {
        chatType = '( Deliverable )';
      } else if (chatType === 'conversations') {
        chatType = '';
      }
    } else {
      chatType = '';
    }

    return (
      <div className={styles.listHeader}>
        <div className={styles.conversationTitleContainer}>
          <div className={styles.conversationTitle}>
            <ChatIcon inverted={true} size={'large'} style={{ marginRight: '5px' }}/>
            {' CHAT ' + chatType}
          </div>
        </div>

        <div className={styles.memberDropdownContainer}>
          <div className="btn-group">
            <div onClick={onToggleConversationMembersView} aria-haspopup="true" aria-expanded="false">
              <UserIcon inverted size={'x-large'} />
              <div className={styles.memberBadge}>{usersCount}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ConversationHeader.propTypes = {
  usersCount: PropTypes.number.isRequired,
  chatType: PropTypes.string,
  onToggleConversationMembersView: PropTypes.func.isRequired,
};

export default ConversationHeader;
