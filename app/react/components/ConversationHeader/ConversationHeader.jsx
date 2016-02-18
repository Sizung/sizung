import React, { PropTypes } from 'react';
import styles from './ConversationHeader.css';
import ChatIcon from '../ChatIcon';
import ConversationMemberListApp from '../../containers/ConversationMemberListApp';
import MeetingParticipantListApp from '../../containers/MeetingParticipantListApp';

class ConversationHeader extends React.Component {
  render() {
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
            <ChatIcon inverted size={'large'} style={{ marginRight: '5px' }}/>
            {' CHAT ' + chatType}
          </div>
        </div>
        <MeetingParticipantListApp parent={this.props.parent} />
        <ConversationMemberListApp />
      </div>
    );
  }
}

ConversationHeader.propTypes = {
  chatType: PropTypes.string,
};

export default ConversationHeader;
