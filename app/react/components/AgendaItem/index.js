// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';
import CommentsCounter from '../CommentsCounter';
import DeliverablesCounter from '../DeliverablesCounter';
import ConversationIcon from '../ConversationIcon';

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

  conversationTitle = () => {
    const { organizationContext, selected, agendaItem } = this.props;
    if (organizationContext) {
      return (
          <div styleName="conversation-title-container">
            <ConversationIcon inverted={selected} style={{ marginRight: '5px' }}/>{ agendaItem.conversation.title }
          </div>
      );
    }
  }


  render() {
    const { agendaItem, selected, currentConversation } = this.props;
    let styleName = 'default';
    if (selected === true) {
      styleName = 'selected';
    }
    return (
      <div styleName="root">
        {AgendaItem.renderUnseenBadge(agendaItem.unseenCount, selected)}
        <div styleName={styleName} onClick={this.handleClick}>
          <div styleName="row">
            <div styleName="content-container" title={agendaItem.title}>
              { agendaItem.title.length > 40 ? agendaItem.title.substring(0, 40) + '...' : agendaItem.title }
            </div>
            <div styleName="status-container">
              <EditableStatus editable={false} status={agendaItem.status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
          <div styleName="bottom-row">
            <div styleName="counter-container">
              <DeliverablesCounter count={agendaItem.deliverablesCount} inverted={selected} />
            </div>
            {this.conversationTitle()}
          </div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  agendaItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    conversation: PropTypes.object,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    deliverablesCount: PropTypes.number.isRequired,
  }).isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
  organizationContext: PropTypes.bool.isRequired,
};

export default AgendaItem;
