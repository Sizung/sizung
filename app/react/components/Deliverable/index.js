// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import User from '../User/index';
import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';
import AgendaItemIcon from '../AgendaItemIcon';
import Time from 'react-time';
import TextWithMentions from '../TextWithMentions';

@CSSModules(styles)
class Deliverable extends React.Component {
  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.visitDeliverable(this.props.deliverable.id);
    };
  }

  handleTitleUpdate(newTitle) {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateDeliverable(this.props.deliverable.id, { status: newStatus });
  }

  agendaItemTitle = () => {
    const { conversationContext, selected, deliverable } = this.props;
    if (conversationContext) {
      return (
        <div styleName="agenda-title-container">
          <AgendaItemIcon size={'small'} inverted={selected} style={{ marginRight: '5px' }}/>
          <TextWithMentions maxLength={40}>{ deliverable.agendaItem.title }</TextWithMentions>
        </div>
      );
    }
  };

  render() {
    const { deliverable, selected } = this.props;
    const { status, title, assignee, dueOn, unseenCount } = deliverable;

    let styleName = 'unseen';
    if (unseenCount > 0) {
      styleName = 'seen';
    }

    return (
      <div styleName='root'>
        <div styleName={styleName} onClick={this.handleClick}>
          <div styleName='row'>
            <div styleName='content-container' title={title}>
              <TextWithMentions maxLength={40}>{ title }</TextWithMentions>
            </div>
            <div styleName='status-container'>
              <EditableStatus editable={false} status={status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
          <div styleName='details-row'>
            <div styleName='details-row1'>
              <div styleName="user-container">
                <User user={assignee} />
              </div>
              { dueOn ? <div styleName="due-on"><Time value={dueOn} format='DD MMM - YYYY' /></div> : ''}
            </div>
            <div styleName='details-row2'>
              {this.agendaItemTitle()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Deliverable.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    agendaItem: PropTypes.object.isRequired,
  }).isRequired,
  visitDeliverable: PropTypes.func.isRequired,
  updateDeliverable: PropTypes.func,
  conversationContext: PropTypes.bool.isRequired,
};

Deliverable.defaultProps = {
  deliverable: {
    title: 'foobar',
    agendaItem: {
      title: 'barfoo',
    },
  },
};

export default Deliverable;
