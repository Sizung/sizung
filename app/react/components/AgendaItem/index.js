// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';
import CommentsCounter from '../CommentsCounter';
import DeliverablesCounter from '../DeliverablesCounter';

@CSSModules(styles)
class AgendaItem extends React.Component {

  constructor() {
    super();

    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.visitAgendaItem(this.props.agendaItem.id);
    };
  }

  handleTitleUpdate(newTitle) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { title: newTitle });
  }

  handleStatusUpdate(newStatus) {
    this.props.updateAgendaItem(this.props.agendaItem.id, { status: newStatus });
  }

  static renderUnseenBadge(count, selected) {
    if (!selected && count && count > 0) {
      return <UnseenBadge count={count} />;
    }
  }

  render() {
    const { agendaItem, selected } = this.props;
    let styleName = 'default';
    if (selected === true) {
      styleName = 'selected';
    }
    return (
      <div styleName="root">
        {AgendaItem.renderUnseenBadge(agendaItem.unseenCount, selected)}
        <div styleName={styleName} onClick={this.handleClick}>
          <div styleName="row">
            <div styleName="content-container">
              <EditableText editable={false} text={agendaItem.title} onUpdate={this.handleTitleUpdate} />
            </div>
            <div styleName="status-container">
              <EditableStatus editable={false} status={agendaItem.status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
          <div styleName="bottom-row">
            <CommentsCounter count={agendaItem.commentsCount} inverted={selected}/>
            <DeliverablesCounter count={agendaItem.deliverablesCount} inverted={selected} />
          </div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    conversationId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    deliverablesCount: PropTypes.number.isRequired,
  }).isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
};

export default AgendaItem;
