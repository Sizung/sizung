// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import User from '../User/index';
import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';
import CommentsCounter from '../CommentsCounter';
import AgendaItemIcon from '../AgendaItemIcon';

@CSSModules(styles)
class Deliverable extends React.Component {
  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectDeliverable(
        this.props.deliverable.agendaItem.conversationId,
        this.props.deliverable.agendaItem.id,
        this.props.deliverable.id
      );
    };
  }

  handleTitleUpdate(newTitle) {
    this.props.updateDeliverable(this.props.deliverable.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateDeliverable(this.props.deliverable.id, { status: newStatus });
  }

  renderUnseenBadge(count, selected) {
    if(!selected && count && count > 0) {
      return <UnseenBadge count={count} />;
    }
  }

  render() {
    const { deliverable, selected } = this.props;
    const { status, title, agendaItem, assignee, dueOn, commentsCount, unseenCount } = deliverable;

    let styleName = 'default';
    if (selected === true) {
      styleName = 'selected';
    }

    return (
      <div styleName='root'>
        {this.renderUnseenBadge(unseenCount, selected)}
        <div styleName={styleName} onClick={this.handleClick}>
          <div styleName='row'>
            <div styleName='content-container'>
              <EditableText editable={false} text={title} onUpdate={this.handleTitleUpdate} />
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
              <div styleName="due-on">
                {dueOn}
              </div>
            </div>
            <div styleName='details-row2'>
              <div styleName="comments-count-container">
                <CommentsCounter count={commentsCount} inverted={selected} />
              </div>
              <div styleName="agenda-title-container">
                <AgendaItemIcon size={'small'} style={{ marginRight: '5px' }}/>{agendaItem.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Deliverable.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    agendaItem: PropTypes.object.isRequired,
  }).isRequired,
  selectDeliverable: PropTypes.func.isRequired,
  updateDeliverable: PropTypes.func.isRequired,
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