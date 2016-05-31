import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './ConversationHeader.css';
import ConversationMembersCounterApp from '../../containers/ConversationMembersCounterApp';
import EditableText from '../EditableText';
import CloseIcon from '../CloseIcon';
import ArchiveIcon from '../ArchiveIcon';

class ConversationHeader extends React.Component {
  static propTypes = {
    conversation: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      organizationId: PropTypes.string.isRequired,
    }),
    updateConversation: PropTypes.func.isRequired,
    navigationHistory: PropTypes.object,
  };

  handleTitleUpdate = (newTitle) => {
    this.props.updateConversation(this.props.conversation.id, { title: newTitle });
  };

  renderTitle = () => {
    const { conversation, chatType } = this.props;

    if (!conversation) { return ''; }

    if (chatType === 'agendaItems' || chatType === 'deliverables') {
      return (
          <Link to={'/conversations/' + conversation.id} className={styles.conversationLink}>
            {conversation.title}
          </Link>
      );
    } else if (chatType === 'conversations') {
      return (
          <EditableText text={conversation.title} onUpdate={this.handleTitleUpdate} maxLength={15} editable={chatType === 'conversations' ? true : false}/>
      );
    }
  };

  deleteConversation = () => {
    this.props.deleteConversation(this.props.conversation.id, this.props.conversation.organizationId);
  };

  renderArchiveAction = () => {
    const { chatType } = this.props;
    if ( chatType === 'conversations') {
      return (
          <div className={styles.archiveIcon} onClick={this.deleteConversation}>
            <ArchiveIcon inverted/>
          </div>
      );
    }
    return null;
  };

  visitMostRecentVisitedParentUrl = () => {
    const { currentConversationObject, navigationHistory } = this.props;
    let mostRecentParentUrl = null;
    const filteredNavigationHistory = navigationHistory.filter((url) => {
      if (currentConversationObject.type === 'deliverables' && currentConversationObject.parent.type === 'agendaItems') {
        if (url.indexOf('/agenda_items/' + currentConversationObject.parent.id) > -1
            || url.indexOf('/conversations/' + currentConversationObject.parent.conversation.id) > -1
            || url.indexOf('/organizations/' + currentConversationObject.parent.conversation.organizationId) > -1) {
          return url;
        }
      } else if (currentConversationObject.type === 'deliverables' && currentConversationObject.parent.type === 'conversations') {
        if (url.indexOf('/conversations/' + currentConversationObject.parent.id) > -1
            || url.indexOf('/organizations/' + currentConversationObject.parent.organizationId) > -1) {
          return url;
        }
      } else if (currentConversationObject.type === 'agendaItems') {
        if (url.indexOf('/conversations/' + currentConversationObject.conversation.id) > -1
            || url.indexOf('/organizations/' + currentConversationObject.conversation.organizationId) > -1) {
          return url;
        }
      }
    });

    mostRecentParentUrl = (filteredNavigationHistory.size > 0 ? filteredNavigationHistory.last() : '/organizations/' + this.props.conversation.organizationId);
    const mostRecentParentType = mostRecentParentUrl.split('/')[1];
    const mostRecentParentId = mostRecentParentUrl.split('/')[2];
    switch (mostRecentParentType) {
      case 'organizations':
        this.props.visitOrganization(mostRecentParentId);
        break;
      case  'conversations':
        this.props.visitConversation(mostRecentParentId);
        break;
      case 'agenda_items':
        this.props.visitAgendaItem(mostRecentParentId);
        break;
      default:
        this.props.visitOrganization(mostRecentParentId);
        break;
    }
  };

  render() {
    const { chatType } = this.props;

    return (
        <div className={ chatType === 'conversations' ? styles.editableRoot : styles.root }>
          <div className={styles.prefix}>@</div>
          <div className={styles.conversationTitle}>
            { this.renderTitle() }
          </div>
          { this.renderArchiveAction() }
          <div className={styles.conversationMemberContainer}>
            <ConversationMembersCounterApp/>
          </div>
          <div onClick={this.visitMostRecentVisitedParentUrl} title="Close Conversation">
            <CloseIcon type={'transparent'} />
          </div>
        </div>
    );
  }
}

export default ConversationHeader;