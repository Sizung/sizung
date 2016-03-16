import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './ConversationHeader.css';
import ConversationMembersCounterApp from '../../containers/ConversationMembersCounterApp';
import EditableText from '../EditableText';

class ConversationHeader extends React.Component {
  static propTypes = {
    conversation: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      organizationId: PropTypes.string.isRequired,
    }),
    updateConversation: PropTypes.func.isRequired,
    conversationMembersViewVisible: PropTypes.bool.isRequired,
  }

  handleTitleUpdate = (newTitle) => {
    this.props.updateConversation(this.props.conversation.id, { title: newTitle });
  }

  renderTitle = () => {
    const { conversation } = this.props;

    if (!conversation) { return ''; }

    return <EditableText text={conversation.title} onUpdate={this.handleTitleUpdate} maxLength={40} />;
  }

  render() {
    const { conversation } = this.props;
    const closeUrl = conversation ? '/organizations/' + conversation.organizationId : '';

    return (
      <div className={styles.root}>
        <div className={styles.prefix}>#</div>
        <div className={styles.conversationTitle}>
          { this.renderTitle() }
        </div>
        <div className={styles.conversationMemberContainer}>
          <ConversationMembersCounterApp conversationMembersViewVisible={this.props.conversationMembersViewVisible}/>
        </div>
        <Link to={closeUrl} title="Close Conversation" className={styles.closeContainer}>
          <div className={styles.close}></div>
        </Link>
      </div>
    );
  }
}

export default ConversationHeader;
