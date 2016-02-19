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

@CSSModules(styles)
class DeliverableInTimeline extends React.Component {
  constructor() {
    super();

    this.renderTimelineHeaderActions = this.renderTimelineHeaderActions.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleDueOnUpdate = this.handleDueOnUpdate.bind(this);
    this.handleAssigneeUpdate = this.handleAssigneeUpdate.bind(this);
    this.handleAgendaItemUpdate = this.handleAgendaItemUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.renderUserName = this.renderUserName.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    };
    this.lastUpdatedTime = this.lastUpdatedTime.bind(this);
  }

  handleTitleUpdate(newTitle) {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateDeliverable(this.props.deliverable.id, { status: newStatus });
  }

  handleDueOnUpdate(newDueOn) {
    this.props.updateDeliverable(this.props.deliverable.id, { due_on: newDueOn });
  }

  handleAssigneeUpdate(newAssigneeId) {
    this.props.updateDeliverable(this.props.deliverable.id, { assignee_id: newAssigneeId });
  }

  handleAgendaItemUpdate(newAgendaItemId) {
    this.props.updateDeliverable(this.props.deliverable.id, { agenda_item_id: newAgendaItemId });
  }

  handleArchive(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to archive this Deliverable?')) {
      this.props.archiveDeliverable(this.props.deliverable.id);
    }
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.visitDeliverable(this.props.deliverable.id);
  }

  lastUpdatedTime() {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.deliverable;
    if (archived) {
      return (<span><span>Archived&nbsp;</span><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  }

  toggleStatus() {
    const { status } = this.props.deliverable;
    if (status === 'open') {
      this.handleStatusUpdate('resolved');
    } else {
      this.handleStatusUpdate('open');
    }
  }

  renderTimelineHeaderActions() {
    return (
        <span>
        <span styleName='discuss-link'><a href="#" styleName='action-btn' onClick={this.handleArchive}>archive</a></span>
      </span>
    );
  }

  renderSettingsOptions() {
    const { status, id } = this.props.deliverable;
    const commentActions = [];
    const _this = this;
    commentActions.push(<li key={id + 'discussDeliverable'}><a href="#" onClick={this.handleSelect}>Discuss Deliverable</a></li>);
    commentActions.push(<li key={id + 'archiveDeliverable'}><a href="#" onClick={this.handleArchive}>Archive Deliverable</a></li>);
    commentActions.push(<li key={id + 'resolveDeliverable'}><a href='#' onClick={this.toggleStatus}>{ (status === 'open') ? 'Mark as Resolved' : 'Mark as Open' }</a></li>);

    if (commentActions.length > 0) {
      return (
          <div styleName='options-menu'>
            <div className="btn-group">
              <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={_this.handleScroll}>
                <i styleName='gear-icon'></i>
              </a>
              <ul ref="gearDropDown" className="dropdown-menu dropdown-menu-right">
                {commentActions}
              </ul>
            </div>
          </div>
      );
    }
    return null;
  }

  renderUserName(user) {
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
      <span styleName='user-name' title={ (user.name ? user.name : '') + ' (' + user.email + ')'}>
        {userName}
      </span>
    );
  }

  renderAsSystemMessage() {
    const { deliverable, showOwner, currentUser } = this.props;
    const { owner, assignee, agendaItem, archived, status, dueOn } = deliverable;
    const { conversationId } = agendaItem;
    const messageContent = (<div>
      <div>
        <span styleName='deliverable-label'>
          {'A Deliverable'}
        </span>{ ' was assigned to ' }
        { this.renderUserName(deliverable.assignee) }
        { dueOn ? <small>{'. Due on '}<Time value={dueOn} format='DD MMM - YYYY' /></small> : ''}
      </div>
      <div styleName={'message-deliverable-title' + (archived ? '-archived' : '')} onClick={ (archived ? '' : this.handleSelect) }>{deliverable.title }</div>
    </div>);

    return (<div styleName={ 'message-root' + (archived ? '-archived' : '')}>
          <div styleName='user-container'>
            <DeliverableIcon size={'small'}/>
            { showOwner ? <User style={{ marginTop: '5px' }} user={owner}/> : '' }
          </div>
          <div styleName='message-container'>
            { !archived ? this.renderSettingsOptions() : '' }
            <div styleName='message-content'>
              {messageContent}
            </div>
            <small>
              {this.lastUpdatedTime()}
              {status === 'resolved' ? <span styleName='resolved-status'><i className='fa fa-check'></i>{' Resolved'}</span> : ''}
            </small>
          </div>
        </div>
    );
  }

  renderAsTimeLineHeader() {
    const { deliverable, showOwner } = this.props;
    const { owner, assignee, agendaItem, archived } = deliverable;
    const { conversationId } = agendaItem;
    return (
      <div styleName={ 'root'+ (archived ? '-archived' : '') }>
        <div styleName='user-container'>
          <DeliverableIcon inverted={true} size={'small'}/>
          { showOwner ? <User style={{ marginTop: '5px' }} user={owner}/> : '' }
        </div>
        <div styleName={'content-container'}>
          <div styleName='row'>
            <div styleName='full-width'>
              <div styleName={'title-container'}>
                <div styleName='title'>
                  <EditableText text={deliverable.title} onUpdate={this.handleTitleUpdate} editable={!archived} inverted={true}/>
                </div>
                <div styleName='assignee'>
                    <span className='pull-right'><EditableUserApp user={assignee} onUpdate={this.handleAssigneeUpdate} editable={!archived} size={'small'} conversationId={conversationId}/></span>
                    <span className='pull-right' styleName={'meta-label'} style={{ padding: '5px' }}>{'ASSIGNED TO'}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName='meta-container'>
            <div styleName='meta-content'>
              <span styleName={'due-on-label'}>{'DUE DATE: '}</span>
              <span styleName='due-on'><EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} /></span>
            </div>
            <div styleName='meta-content'>
              <AgendaItemIcon size={'small'} style={{marginRight: '5px'}} inverted={true}/>
              <span><EditableAgendaItem agendaItem={agendaItem} onUpdate={this.handleAgendaItemUpdate} editable={!archived} inverted={true}/></span>
            </div>
          </div>
          <div styleName='time-container'>
            <div styleName='status-container'>
              <EditableStatus status={deliverable.status} onUpdate={this.handleStatusUpdate} editable={!archived} />
            </div>
            <small>
              {this.lastUpdatedTime()}
            </small>
            { archived ? '' : this.renderTimelineHeaderActions() }
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.isTimelineHeader) {
      return this.renderAsTimeLineHeader();
    }
    return this.renderAsSystemMessage();
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
  isTimelineHeader: PropTypes.bool,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

DeliverableInTimeline.defaultProps = {
  showOwner: true,
};

export default DeliverableInTimeline;
