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

  renderActions = () => {
    const { archived } = this.props.agendaItem;
    return (!archived ? <a href="#" className={ styles.actionBtn } onClick={this.handleArchive}>Archive</a> : null);
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
          <div className={ styles.actionsContainer }>
            <div className={ styles.statusContainer }>
              { this.renderActions() }
              <EditableStatus status={status} onUpdate={this.handleStatusUpdate} editable={!archived} />
            </div>
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