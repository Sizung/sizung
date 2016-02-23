// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time';
import User from '../User/index';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import AgendaItemIcon from '../AgendaItemIcon';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions';

class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();
  }

  handleStatusUpdate = (newStatus) => {
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: newStatus });
  };

  handleSelect = (e) => {
    e.preventDefault();
    this.props.visitAgendaItem(this.props.agendaItem.id);
  };

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveAgendaItem(this.props.agendaItem.id);
  };

  toggleStatus = () => {
    const { status } = this.props.agendaItem;
    if (status === 'open') {
      this.handleStatusUpdate('resolved');
    } else {
      this.handleStatusUpdate('open');
    }
  };

  lastUpdatedTime = () => {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.agendaItem;
    if (archived) {
      return (<span><span >Archived&nbsp;</span><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  };

  renderActions = () => {
    const { status, id, archived } = this.props.agendaItem;
    const actions = [];

    if (!archived) {
      actions.push(<li key={id + 'discussAgendaItem'}><a href="#" onClick={this.handleSelect}>Discuss Agenda Item</a></li>);
      actions.push(<li key={id + 'archiveAgendaItem'}><a href="#" onClick={this.handleArchive}>Archive Agenda Item</a></li>);
      actions.push(<li key={id + 'resolveAgendaItem'}><a href='#' onClick={this.toggleStatus}>{ (status === 'open') ? 'Mark as Resolved' : 'Mark as Open' }</a></li>);
    }

    if (actions.length > 0) {
      return (
          <div className={styles.actionDropDown}>
              <a className='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onClick={this.handleScroll}>
                <i className={styles.gearIcon}></i>
              </a>
              <ul ref='gearDropDown' className='dropdown-menu dropdown-menu-right'>
                {actions}
              </ul>
          </div>
      );
    }
    return null;
  };

  renderUserName = (user) => {
    const { currentUser } = this.props;
    let userName = '';
    if (currentUser) {
      if (currentUser.id === user.id) {
        userName = 'You';
      } else if (user.firstName && user.firstName.trim() !== '') {
        userName = user.firstName;
      } else {
        userName = user.email;
      }
    }
    return (
        <span className='userName' title={ (user.name ? user.name : '') + ' (' + user.email + ')'}>
        {userName}
      </span>
    );
  };

  render() {
    const { agendaItem, showOwner, currentUser } = this.props;
    const { archived, status, owner } = agendaItem;
    const content = (<div>
      <div>
        <span className={styles.agendaItemLabel}>
          {'An Agenda Item'}
        </span>
        {' was raised by '}
        {this.renderUserName(agendaItem.owner)}
      </div>
      <div className={ !archived ? styles.title : styles.titleArchived } onClick={ (archived ? '' : this.handleSelect) }>
        <TextWithMentions>
          {agendaItem.title}
        </TextWithMentions>
      </div>
    </div>);

    return (<div className={ !archived ? styles.root : styles.rootArchived }>
      <div className={styles.userContainer}>
        <div className={styles.agendaItemIconContainer}><AgendaItemIcon/></div>
        { showOwner ? <div style={{ marginTop: '5px' }}><User user={owner}/></div> : ''}
      </div>
      <div className={styles.contentContainer}>
        { this.renderActions() }
        <div className={styles.content}>
          {content}
        </div>
        <small>
          {this.lastUpdatedTime()}
          {status === 'resolved' ? <span className={styles.status}><i className='fa fa-check'></i>{' Resolved'}</span> : ''}
        </small>
      </div>
    </div>
    );
  }
}

AgendaItemInTimeline.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  updateAgendaItem: PropTypes.func.isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

AgendaItemInTimeline.defaultProps = {
  showOwner: true,
};
export default AgendaItemInTimeline;