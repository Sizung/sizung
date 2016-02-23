// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';
import DeliverablesCounter from '../DeliverablesCounter';
import ConversationIcon from '../ConversationIcon';
import User from '../User';
import TextWithMentions from '../TextWithMentions';

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

  conversationTitle = () => {
    const { organizationContext, selected, agendaItem } = this.props;
    if (organizationContext) {
      return (
          <div styleName="conversation-title-container">
            <ConversationIcon inverted={selected} style={{ marginRight: '5px' }}/>{ agendaItem.conversation.title }
          </div>
      );
    }
  };

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
            <div styleName="content-container" title={agendaItem.title}>
              <TextWithMentions maxLength={40}>{agendaItem.title}</TextWithMentions>
            </div>
            <div styleName="status-container">
              <EditableStatus editable={false} status={agendaItem.status} onUpdate={this.handleStatusUpdate} />
            </div>
          </div>
          <div styleName="bottom-row">
            <div styleName="counter-container">
              <User user={ agendaItem.owner } innerStyle={ (selected ? { border: '1px solid #ffffff' } : {})}/>
              <div style={{ display: 'inline-block', marginTop: '5px', marginLeft: '5px', float: 'right' }}>
                <DeliverablesCounter count={agendaItem.deliverablesCount} inverted={selected}/>
              </div>
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
