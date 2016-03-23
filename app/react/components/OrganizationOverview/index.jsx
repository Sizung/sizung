import React, { Component, PropTypes } from 'react';
import Organization from '../Organization';
import Conversation from '../Conversation';
import AgendaItemList from '../AgendaItemList';
import DeliverableList from '../DeliverableList';
import ConversationLayout from '../ConversationLayout';
import Icon from '../Icon';
import PlusIcon from '../PlusIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class OrganizationOverview extends Component {

  conversationElements = (conversations) => {
    const elements = conversations.map((conversation) => {
      return <Conversation key={ conversation.id } conversation={ conversation } users={ this.props.users } />;
    }).toJS();

    return elements;
  };

  render() {
    const { organization, conversations, agendaItems, visitAgendaItem, deliverables, visitDeliverable } = this.props;

    return (
      <div styleName="root" ref="root">
        <Organization organization={organization} ref='organization' />
        <ConversationLayout
          left={ <AgendaItemList agendaItems={ agendaItems } visitAgendaItem={ visitAgendaItem } /> }
          right={ <DeliverableList deliverables={ deliverables } visitDeliverable={ visitDeliverable } /> }
        >
          <div styleName='center-panel'>
            <div styleName="header-container">
              <div styleName='title'>
                <Icon type="chat" style={{ marginRight: '20px' }}>CONVERSATIONS</Icon>
              </div>
              <div styleName="action">
                <a href={'/organizations/' + organization.id + '/conversations/new'}>
                  <PlusIcon />
                </a>
              </div>
            </div>
            <div styleName='center-panel-list'>
              { this.conversationElements(conversations) }
            </div>
          </div>
        </ConversationLayout>
      </div>
    );
  }
}

OrganizationOverview.propTypes = {
  organization: PropTypes.object.isRequired,
  conversations: PropTypes.object.isRequired,
  agendaItems: PropTypes.object.isRequired,
  deliverables: PropTypes.object.isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
  visitDeliverable: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

export default OrganizationOverview;
