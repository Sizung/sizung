// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time';
import User from '../User/index';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import AgendaItemIcon from '../AgendaItemIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.renderTimelineHeaderActions = this.renderTimelineHeaderActions.bind(this);
    this.lastUpdatedTime = this.lastUpdatedTime.bind(this);
    this.renderAsSystemMessage = this.renderAsSystemMessage.bind(this);
    this.renderAsTimeLineHeader = this.renderAsTimeLineHeader.bind(this);
    this.renderSettingsOptions = this.renderSettingsOptions.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.renderUserName = this.renderUserName.bind(this);
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: newStatus });
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.visitAgendaItem(this.props.agendaItem.id);
  }

  handleArchive(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to archive this Agenda Item?")) {
      this.props.archiveAgendaItem(this.props.agendaItem.id);
    }
  }

  toggleStatus() {
    const { status } = this.props.agendaItem;
    if (status === 'open') {
      this.handleStatusUpdate('resolved');
    } else {
      this.handleStatusUpdate('open');
    }
  }

  lastUpdatedTime() {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.agendaItem;
    if (archived) {
      return (<span><span >Archived&nbsp;</span><Time value={archivedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat='YYYY/MM/DD HH:mm' relative /></span>);
    }
    return <Time value={createdAt} titleFormat='YYYY/MM/DD HH:mm' relative />;
  }

  renderSettingsOptions() {
    const { status, id } = this.props.agendaItem;
    const commentActions = [];
    const _this = this;
    commentActions.push(<li key={id + 'discussAgendaItem'}><a href="#" onClick={this.handleSelect}>Discuss Agenda Item</a></li>);
    commentActions.push(<li key={id + 'archiveAgendaItem'}><a href="#" onClick={this.handleArchive}>Archive Agenda Item</a></li>);
    commentActions.push(<li key={id + 'resolveAgendaItem'}><a href='#' onClick={this.toggleStatus}>{ (status === 'open') ? 'Mark as Resolved' : 'Mark as Open' }</a></li>);

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
    const { agendaItem, showOwner, currentUser } = this.props;
    const { archived, status, owner } = agendaItem;
    const archiveBlanketStyle = ( archived ? 'archive-wrapper' : '');
    const messageContent = (<div>
      <div>
        <span styleName='agenda-item-label'>
          {'An Agenda Item'}
        </span>
        {' was raised by '}
        {this.renderUserName(agendaItem.owner)}
      </div>
      <div styleName={'title' + (archived ? '-archived' : '')} onClick={ (archived ? '' : this.handleSelect) }>{agendaItem.title }</div>
    </div>);

    return (<div styleName='message-root'>
      <div styleName='user-container'>
        <div style={{ padding: '0px 10px' }}><AgendaItemIcon/></div>
        { showOwner ? <div style={{ marginTop: '5px' }}><User user={owner}/></div> : ''}
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
      { archived ? <div styleName={archiveBlanketStyle}></div> : '' }
    </div>
    );
  }

  renderTimelineHeaderActions() {
    return (
        <span>
        <span styleName='discuss-link'><a href="#" styleName='action-btn' onClick={this.handleArchive}>archive</a></span>
      </span>
    );
  }

  renderAsTimeLineHeader() {
    const { agendaItem, showOwner } = this.props;
    const { title, status, owner, archived } = agendaItem;

    const archiveBlanketStyle = (archived ? 'archive-wrapper' : '');
    return (
        <div styleName='root'>
          <div styleName='user-container'>
            <div style={{ padding: '0px 10px' }}>
              <AgendaItemIcon inverted={true}/>
            </div>
            { showOwner ? <div style={{ marginTop: '5px' }}><User user={owner} innerStyle={{ border: '1px solid #ffffff' }}/></div> : ''}
          </div>
          <div styleName={'content-container'}>
            <div styleName="title-container">
              <EditableText text={title} onUpdate={this.handleTitleUpdate} editable={!archived} inverted={true}/>
            </div>
            <div styleName='time-container-inverse'>
              <div styleName='status-container'>
                <EditableStatus status={status} onUpdate={this.handleStatusUpdate} editable={!archived} />
              </div>
              <small>
                {this.lastUpdatedTime()}
              </small>
              { archived ? '' : this.renderTimelineHeaderActions() }
            </div>
          </div>
          { archived ? <div styleName={archiveBlanketStyle}></div> : '' }
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

AgendaItemInTimeline.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  updateAgendaItem: PropTypes.func.isRequired,
  isTimelineHeader: PropTypes.bool,
  visitAgendaItem: PropTypes.func.isRequired,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

AgendaItemInTimeline.defaultProps = {
  showOwner: true,
};
export default AgendaItemInTimeline;