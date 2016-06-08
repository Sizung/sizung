import React, { PropTypes } from 'react';
import styles from './index.css';
import EditableText from '../EditableText';
import Icon from '../Icon';
import ArchiveIcon from '../ArchiveIcon';
import ResolveIcon from '../ResolveIcon';
import TextWithMentions from '../TextWithMentions';

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
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: (agendaItem.status === 'open' ? 'resolved' : agendaItem.status) });
  };

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveAgendaItem(this.props.agendaItem.id);
  };

  renderArchiveAction = () => {
    return (
      <div className={styles.archiveContainer} onClick={this.handleArchive}>
        <span className={styles.iconContainer}>
          <ArchiveIcon size={'x-large'} />
        </span>
        <span>
          {'Archive'}
        </span>
    </div>);
  };

  renderResolveAction = () => {
    const { agendaItem, selected } = this.props;
    if (agendaItem.status !== 'resolved' && selected) {
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
    } else if (agendaItem.status === 'resolved') {
      return (
          <div className={styles.resolvedIcon}>
            <ResolveIcon resolved/>
          </div>
      );
    }
    return null;
  };

  renderBottomRow = () => {
    const { selected } = this.props;
    return (
      <div className={styles.actionContainer}>
        { selected ? this.renderArchiveAction() : this.parentContextTitle()}
        { this.renderResolveAction() }
      </div>
    );
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
    const { agendaItem, context } = this.props;
    if (context === 'organization') {
      return (
        <div className={styles.contextTitle}>
          <Icon type="chat" gap="1rem" style={{ fontSize: '1rem' }}/>
          <TextWithMentions maxLength={40}>{ agendaItem.conversation.title }</TextWithMentions>
        </div>
      );
    }
    return null;
  };
  
  render() {
    const { agendaItem, selected } = this.props;
    let styleName = styles.seen;
    if (selected) {
      styleName = styles.selected;
    } else if (agendaItem.unseenCount > 0) {
      styleName = styles.unseen;
    }
    return (
      <div ref='agendaItem' className={styleName} onClick={this.handleClick}>
        <div className={styles.leftStrip}></div>
        <div className={styles.contentContainer} title={agendaItem.title}>
          <div className={styles.titleContainer}>
            <div className={styles.agendaItemIconContainer}>
              <Icon type="agendaItem" />
            </div>
            <div className={styles.title}>
              <EditableText text={agendaItem.title} onUpdate={this.handleTitleUpdate} editable={selected} inverted maxLength={40} />
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
  context: PropTypes.string,
};

export default AgendaItem;
