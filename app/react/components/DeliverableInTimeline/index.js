// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';

import Time from 'react-time';
import User from '../User/index';
import EditableUserApp from '../../containers/EditableUserApp';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import EditableDate from '../EditableDate';
import EditableAgendaItem from '../EditableAgendaItem';
import DeliverableIcon from '../DeliverableIcon';
import AgendaItemIcon from '../AgendaItemIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions';

@CSSModules(styles)
class DeliverableInTimeline extends React.Component {
  constructor() {
    super();
  }

  handleStatusUpdate = (newStatus) => {
    this.props.updateDeliverable(this.props.deliverable.id, { status: newStatus });
  };

  handleArchive = (e) => {
    e.preventDefault();
    this.props.archiveDeliverable(this.props.deliverable.id);
  };

  handleSelect = (e) => {
    e.preventDefault();
    this.props.visitDeliverable(this.props.deliverable.id);
  };

  lastUpdatedTime = () => {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.deliverable;
    if (archived) {
      return (<span><span>Archived&nbsp;</span><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  };

  toggleStatus = () => {
    const { status } = this.props.deliverable;
    if (status === 'open') {
      this.handleStatusUpdate('resolved');
    } else {
      this.handleStatusUpdate('open');
    }
  };

  renderActions = () => {
    const { status, id, archived } = this.props.deliverable;
    const actions = [];
    if (!archived) {
      actions.push(<li key={id + 'discussDeliverable'}><a href='#' onClick={this.handleSelect}>Discuss Deliverable</a></li>);
      actions.push(<li key={id + 'archiveDeliverable'}><a href='#' onClick={this.handleArchive}>Archive Deliverable</a></li>);
      actions.push(<li key={id + 'resolveDeliverable'}><a href='#' onClick={this.toggleStatus}>{ (status === 'open') ? 'Mark as Resolved' : 'Mark as Open' }</a></li>);

      if (actions.length > 0) {
        return (
          <div className={styles.actionDropdown}>
            <div className='btn-group'>
              <a className='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onClick={this.handleScroll}>
                <i className={styles.gearIcon}></i>
              </a>
              <ul ref='gearDropDown' className='dropdown-menu dropdown-menu-right'>
                {actions}
              </ul>
            </div>
          </div>
        );
      }
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
      <span className={styles.userName} title={ (user.name ? user.name : '') + ' (' + user.email + ')'}>
        {userName}
      </span>
    );
  };

  render() {
    const { deliverable, showOwner } = this.props;
    const { owner, archived, status, dueOn } = deliverable;
    const content = (<div>
      <div>
        <span className={styles.deliverableLabel}>
          {'A Deliverable'}
        </span>{ ' was assigned to ' }
        { this.renderUserName(deliverable.assignee) }
        { dueOn ? <small>{'. Due on '}<Time value={dueOn} format='DD MMM - YYYY' /></small> : ''}
      </div>
      <div className={ archived ? styles.titleArchived : styles.title } onClick={ (archived ? '' : this.handleSelect) }>
        <TextWithMentions>
          {deliverable.title}
        </TextWithMentions>
      </div>
    </div>);

    return (
      <div className={archived ? styles.rootArchived : styles.root}>
        <div className={styles.userContainer}>
          <DeliverableIcon size={'small'}/>
          { showOwner ? <User style={{ marginTop: '5px' }} user={owner}/> : '' }
        </div>
        <div className={styles.contentContainer}>
          { this.renderActions() }
          <div className={styles.content}>
            {content}
          </div>
          <small>
            {this.lastUpdatedTime()}
            {status === 'resolved' ? <span className={styles.resolvedStatus}><i className='fa fa-check'></i>{' Resolved'}</span> : ''}
          </small>
        </div>
      </div>
    );
  }
}

DeliverableInTimeline.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dueOn: PropTypes.string,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    agendaItem: PropTypes.shape({
      title: PropTypes.string.isRequired,
      conversationId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateDeliverable: PropTypes.func.isRequired,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

DeliverableInTimeline.defaultProps = {
  showOwner: true,
};

export default DeliverableInTimeline;
