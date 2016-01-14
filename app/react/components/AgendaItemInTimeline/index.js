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
    this.renderActionButtons = this.renderActionButtons.bind(this);
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: newStatus });
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.visitAgendaItem(this.props.agendaItem.conversationId, this.props.agendaItem.id);
  }

  handleArchive(e) {
    e.preventDefault();
    this.props.archiveAgendaItem(this.props.agendaItem.id);
  }

  renderActionButtons() {
    let discussOptionStyle = "discuss-link";
    if (this.props.isTimelineHeader !== null) {
      discussOptionStyle = (this.props.isTimelineHeader ? 'discuss-link-hide' : 'discuss-link');
    }

    return (
      <span>
        <span styleName='discuss-link'><a href="#" className='btn btn-xs btn-default' onClick={this.handleArchive}>archive</a></span>
        <span styleName={discussOptionStyle}><a href="#" className='btn btn-xs btn-default' onClick={this.handleSelect}>discuss</a></span>
      </span>
    );
  }

  render() {
    const { agendaItem } = this.props;
    const { title, status, owner, archived } = agendaItem;

    const timeStyle = ( this.props.isTimelineHeader ? "time-container-inverse" : "time-container");
    if ( this.props.isTimelineHeader ) {
      console.log("this.props.isTimelineHeader: " + this.props.isTimelineHeader);
    }
    return (
      <div styleName='root'>
        <div styleName='user-container'>
          <div style={{padding: '0px 10px'}}><AgendaItemIcon inverted={this.props.isTimelineHeader}/></div>
          <div style={{marginTop: '5px'}}><User user={owner}/></div>
        </div>
        <div styleName="content-container">
          <div styleName="title-container">
            <EditableText text={title} onUpdate={this.handleTitleUpdate} editable={!archived} />
          </div>
          <div styleName="status-container">
            <EditableStatus status={status} onUpdate={this.handleStatusUpdate} editable={!archived} />
          </div>
        </div>
        <div styleName={timeStyle}>
          <small>
            <Time value={agendaItem.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative />
            { archived ? ' (archived)' : '' }
          </small>
          { archived ? '' : this.renderActionButtons() }
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
  isTimelineHeader: PropTypes.bool,
  visitAgendaItem: PropTypes.func.isRequired,
  isTimelineHeader: PropTypes.bool
};

export default AgendaItemInTimeline;