// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time';
import User from '../User/index';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import AgendaItemIcon from '../AgendaItemIcon';
import styles from './index.css';

class AgendaItemAsTimelineHeader extends React.Component {
  constructor() {
    super();
  }

  handleTitleUpdate = (newTitle) => {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  };

  handleStatusUpdate = (newStatus) => {
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: newStatus });
  };

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveAgendaItem(this.props.agendaItem.id);
  };

  lastUpdatedTime = () => {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.agendaItem;
    if (archived) {
      return (<span><span>Archived&nbsp;</span><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  };

  renderActions = () => {
    return (!this.props.agendaItem.archived ? <span><span className={styles.discussLink}><a href="#" className={styles.actionBtn} onClick={this.handleArchive}>archive</a></span></span> : null);
  };

  render() {
    const { agendaItem, showOwner } = this.props;
    const { title, status, owner, archived } = agendaItem;

    return (
      <div className={ !archived ? styles.root : styles.rootArchived }>
        <div className={ styles.userContainer }>
          <div className={ styles.agendaItemIconContainer }>
            <AgendaItemIcon inverted={true}/>
          </div>
          { showOwner ? <div style={{ marginTop: '5px' }}><User user={owner} innerStyle={{ border: '1px solid #ffffff' }}/></div> : ''}
        </div>
        <div className={ styles.contentContainer }>
          <div className={ styles.titleContainer }>
            <EditableText text={title} onUpdate={this.handleTitleUpdate} editable={!archived} inverted={true}/>
          </div>
          <div className={ styles.timeContainer }>
            <div className={ styles.statusContainer }>
              <EditableStatus status={status} onUpdate={this.handleStatusUpdate} editable={!archived} />
            </div>
            <small>
              {this.lastUpdatedTime()}
            </small>
            { this.renderActions() }
          </div>
        </div>
      </div>
    );
  }
}

AgendaItemAsTimelineHeader.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  updateAgendaItem: PropTypes.func.isRequired,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

AgendaItemAsTimelineHeader.defaultProps = {
  showOwner: true,
};
export default AgendaItemAsTimelineHeader;