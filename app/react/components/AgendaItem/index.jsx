import React, { PropTypes } from 'react';
import styles from './index.css';
import EditableText from '../EditableText';
import Icon from '../Icon';
import ArchiveIcon from '../ArchiveIcon';
import ResolveIcon from '../ResolveIcon';

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
    const { agendaItem } = this.props;
    if (agendaItem.status !== 'resolved') {
      return (
        <div className={styles.statusContainer} onClick={this.handleStatusUpdate}>
          <span className={styles.iconContainer}>
            <ResolveIcon size={'x-large'} />
          </span>
          <span>
            {'Resolve'}
          </span>
        </div>
      );
    }
    return null;
  };

  renderActions = () => {
    const { agendaItem, selected } = this.props;
    if (selected && !agendaItem.archived) {
      return (
        <div className={styles.actionContainer}>
          {this.renderArchiveAction()}
          {this.renderResolveAction()}
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
      <div className={styleName} onClick={this.handleClick}>
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
        {this.renderActions()}
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
};

export default AgendaItem;
