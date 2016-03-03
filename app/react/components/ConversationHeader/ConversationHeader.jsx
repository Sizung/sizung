import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './ConversationHeader.css';
import ConversationMemberListApp from '../../containers/ConversationMemberListApp';
import MeetingParticipantListApp from '../../containers/MeetingParticipantListApp';

class ConversationHeader extends React.Component {
  static propTypes = {
    conversation: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      organizationId: PropTypes.string.isRequired,
    }),
  }

  render() {
    const { conversation } = this.props;
    const closeUrl = conversation ? '/organizations/' + conversation.organizationId : '';

    return (
      <div className={styles.listHeader}>
        <div className={styles.conversationTitleContainer}>
          <div className={styles.conversationTitle}>
            { conversation ? ('#' + conversation.title) : ''}
          </div>
        </div>
        <Link to={closeUrl} title="Close Conversation">
          <div className={styles.close}></div>
        </Link>
        <span>
          <MeetingParticipantListApp parent={this.props.parent} />
        </span>
        <span>
          <ConversationMemberListApp />
        </span>
      </div>
    );
  }
}

export default ConversationHeader;
