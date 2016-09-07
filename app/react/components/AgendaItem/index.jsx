import React, { PropTypes } from 'react';
import styles from './index.css';
import EditableText from '../EditableText';
import Icon from '../Icon';
import ArchiveIcon from '../ArchiveIcon';
import ResolveIcon from '../ResolveIcon';
import TextWithMentions from '../TextWithMentions';
import EditableUserApp from '../../containers/EditableUserApp';

class AgendaItem extends React.Component {

  handleClick = (e) => {
    e.preventDefault();
    this.props.visitAgendaItem(this.props.agendaItem.id);
  };

  handleTitleUpdate = (newTitle) => {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  };

  handleStatusUpdate = () => {
    const { agendaItem } = this.props;
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: (agendaItem.status === 'open' ? 'resolved' : 'open') });
  };

  handleOwnerUpdate = (ownerId) => {
    if (ownerId !== this.props.agendaItem.ownerId) {
      this.props.updateAgendaItem(this.props.agendaItem.id, { owner_id: ownerId });
    }
  };

  handleArchive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { deliverablesCount } = this.props.agendaItem;
    let prompt;
    if (deliverablesCount === 0) {
      prompt = 'Are you sure you want to archive this Agenda Item?';
    } else {
      prompt = 'Are you sure you want to archive this Agenda Item and its related Action Items?';
    }
    if (confirm(prompt)) {
      this.props.archiveAgendaItem(this.props.agendaItem.id);
    }
  };

  renderArchiveAction = () => {
    return (
      <div className={styles.archiveContainer} onClick={this.handleArchive}>
        <span className={styles.iconContainer}>
          <ArchiveIcon size={'x-large'} />
        </span>
    </div>);
  };

  renderResolveAction = () => {
    const { agendaItem, selected } = this.props;
    if (agendaItem.status !== 'resolved' && this.isEditable()) {
      return (
        <div className={styles.statusContainer} onClick={this.handleStatusUpdate}>
          <div className={styles.iconContainer}>
            <ResolveIcon />
          </div>
          <span>
            {'Resolve'}
          </span>
        </div>
      );
    }
    return null;
  };

  renderBottomRow = () => {
    const { agendaItem, selected } = this.props;
    return (
      <div className={styles.actionContainer}>
        <div className={styles.actions}>
          { this.renderResolveAction() }
          { this.isEditable() ? this.renderArchiveAction() : this.parentContextTitle()}
        </div>
        { selected ?
          <div className={styles.owner}>
            <EditableUserApp conversationId={agendaItem.conversationId} editable userId={agendaItem.ownerId} onUpdate={this.handleOwnerUpdate} />
          </div> : undefined }
      </div>
    );
  };

  isEditable = () => {
    return (this.props.selected && this.props.currentTimeline && this.props.currentTimeline !== 'deliverable');
  };

  isElementOutViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
  };

  componentDidUpdate() {
    if (this.props.selected && this.isElementOutViewport(this.refs.agendaItem)) {
      this.refs.agendaItem.scrollIntoView();
    }
  }

  parentContextTitle = () => {
    const { agendaItem, currentTimeline } = this.props;
    if (currentTimeline === 'organization') {
      return (
        <div className={styles.contextTitle}>
          <Icon type="chat" gap="1rem" style={{ fontSize: '1rem' }}/>
          { agendaItem.conversation.title }
        </div>
      );
    }
    return null;
  };

  renderResolvedIcon = () => {
    const { agendaItem, selected } = this.props;
    if (agendaItem.status === 'resolved') {
      return (
          <div className={styles.resolvedIcon} onClick={ selected ? this.handleStatusUpdate : null }>
            <ResolveIcon resolved/>
          </div>
      );
    }
  };

  renderAgendaItemIcon = () => {
    return (
      <div className={styles.agendaItemIconContainer}>
        <Icon type="agendaItem" />
      </div>
    );
  };

  render() {
    const { agendaItem, selected } = this.props;
    let styleName = styles.seen;
    if (selected) {
      styleName = styles.selected;
    } else if (agendaItem.status === 'resolved') {
      styleName = styles.resolved;
    } else if (agendaItem.unseenCount > 0) {
      styleName = styles.unseen;
    }
    return (
      <div ref='agendaItem' className={styleName} onClick={this.handleClick}>
        <div className={styles.leftStrip}></div>
        <div className={styles.contentContainer} title={agendaItem.title}>
          <div className={styles.titleContainer}>
            { agendaItem.status === 'resolved' ? this.renderResolvedIcon() : this.renderAgendaItemIcon() }
            <div className={styles.title}>
              <EditableText text={agendaItem.title} onUpdate={this.handleTitleUpdate} editable={this.isEditable()} inverted maxLength={40} />
            </div>
          </div>
        </div>
        {this.renderBottomRow()}
      </div>
    );
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    conversation: PropTypes.object,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    deliverablesCount: PropTypes.number.isRequired,
  }).isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
  archiveAgendaItem: PropTypes.func,
  currentTimeline: PropTypes.string,
};

export default AgendaItem;
