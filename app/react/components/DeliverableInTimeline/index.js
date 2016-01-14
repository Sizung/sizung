// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

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

    this.renderActionButtons = this.renderActionButtons.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.handleDueOnUpdate = this.handleDueOnUpdate.bind(this);
    this.handleAssigneeUpdate = this.handleAssigneeUpdate.bind(this);
    this.handleAgendaItemUpdate = this.handleAgendaItemUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.id);
    };
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
    this.props.archiveDeliverable(this.props.deliverable.id);
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.selectDeliverable(
      this.props.deliverable.agendaItem.conversationId,
      this.props.deliverable.agendaItem.id,
      this.props.deliverable.id
    );
  }

  renderActionButtons() {
    let discussOptionStyle = 'discuss-link';
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
    const { deliverable } = this.props;
    const { owner, assignee, agendaItem, archived } = deliverable;
    const { conversationId } = agendaItem;

    return (
      <div styleName='root'>
        <div styleName='user-container'>
          <DeliverableIcon inverted={this.props.isTimelineHeader} size={'small'}/>
          <User style={{ marginTop: '5px' }} user={owner}/>
        </div>
        <div styleName={"content-container"+ (this.props.isTimelineHeader ? '-inverted' : '')}>
          <div styleName="row">
            <div styleName="full-width">
              <div styleName={"title-container" + (this.props.isTimelineHeader ? '-inverted' : '')}>
                <div className='col-xs-12 col-sm-8 zero-padding'>
                  <span>{deliverable.title}</span>
                </div>
                <div className='col-xs-6-pull-right col-sm-4 zero-padding'>
                    <span className="pull-right"><EditableUserApp user={assignee} onUpdate={this.handleAssigneeUpdate} editable={!archived} size={'small'}/></span>
                    <span className="pull-right" styleName={"meta-label" + (this.props.isTimelineHeader ? '-inverted' : '')} style={{padding: '5px'}}>{'ASSIGNED TO'}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="meta-container">
            <div styleName="meta-content">
              <span styleName={'due-on-label'+  (this.props.isTimelineHeader ? '-inverted' : '')}>{"DUE DATE: "}</span>
              <span styleName='due-on'><EditableDate value={deliverable.dueOn} onUpdate={this.handleDueOnUpdate} editable={!archived} /></span>
            </div>
            <div styleName="meta-content">
              <AgendaItemIcon size={'small'} style={{marginRight: '5px'}} inverted={this.props.isTimelineHeader}/>
              <span><EditableAgendaItem agendaItem={agendaItem} onUpdate={this.handleAgendaItemUpdate} editable={!archived} inverted={this.props.isTimelineHeader}/></span>
            </div>
          </div>
          <div styleName="time-container">
            <small>
              <Time value={deliverable.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative />
              { archived ? ' (archived)' : '' }
            </small>
            { archived ? '' : ''}
          </div>
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
  isTimelineHeader: PropTypes.bool,
};

export default DeliverableInTimeline;