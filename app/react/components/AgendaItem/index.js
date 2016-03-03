// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import styles from './index.css';

import EditableStatus from '../EditableStatus';
import EditableText from '../EditableText';
import UnseenBadge from '../UnseenBadge';
import DeliverablesCounter from '../DeliverablesCounter';
import ConversationIcon from '../ConversationIcon';
import User from '../User';
import TextWithMentions from '../TextWithMentions';
import AgendaItemIcon from '../AgendaItemIcon';
import ArchiveIcon from '../ArchiveIcon';
import ResolveIcon from '../ResolveIcon';

class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.visitAgendaItem(this.props.agendaItem.id);
    };
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  }

  handleStatusUpdate() {
    const { agendaItem } = this.props;
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: (agendaItem.status === 'open' ? 'resolved' : agendaItem.status) });
  }

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveAgendaItem(this.props.agendaItem.id);
  };

  renderArchiveAction = () => {
    return(
      <div style={{ float: 'left'}}>
        <span style={{ marginRight: '5px'}}>
          <ArchiveIcon size={'x-large'}/>
        </span>
      <span onClick={this.handleArchive}>
        {'Archive'}
      </span>
    </div>);
  }

  renderResolveAction = () => {
    const { agendaItem } = this.props;
    if (agendaItem.status !== 'resolved' ) {
      return(
        <div style={{ float: 'right'}}>
          <span style={{ marginRight: '5px'}}>
            <ResolveIcon size={'x-large'}/>
          </span>
          <span onClick={this.handleStatusUpdate}>
            {'Resolve'}
          </span>
        </div>
      );
    }
    return null;
  }

  renderActions = () => {
    const { agendaItem, selected } = this.props;
    if (selected && !agendaItem.archived) {
      return (
        <div style={{ width: '100%', padding: '0px 10px', marginTop: '1em', marginBottom: '2em'}}>
          {this.renderArchiveAction()}
          {this.renderResolveAction()}
        </div>
      );
    }
    return null;
  }

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
        <div className={styles.leftColumn}>
          <div className={styles.row}>
            <div className={styles.contentContainer} title={agendaItem.title}>
              <div className={styles.agendaItemIconContainer}>
                <AgendaItemIcon inverted={true}/>
              </div>
              <div className={styles.titleContainer}>
                <EditableText text={agendaItem.title} onUpdate={this.handleTitleUpdate} editable={selected && !agendaItem.archived} inverted={true} maxLength={40}/>
              </div>
            </div>
            {this.renderActions()}
          </div>
        </div>
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
  organizationContext: PropTypes.bool.isRequired,
  archiveAgendaItem: PropTypes.func.isRequired
};

export default AgendaItem;
