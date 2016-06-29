import React, { Component, PropTypes } from 'react';
import Organization from '../Organization';
import Conversation from '../Conversation';
import AgendaItemList from '../AgendaItemList';
import DeliverableList from '../DeliverableList';
import ConversationLayout from '../ConversationLayout';
import CreateConversationApp from '../../containers/CreateConversationApp';
import ConversationSettingsApp from '../../containers/ConversationSettingsApp';
import Icon from '../Icon';
import PlusIcon from '../PlusIcon';
import styles from './index.css';

class OrganizationOverview extends Component {

  conversationElements = (conversations) => {
    const elements = conversations.map((conversation) => {
      return <Conversation key={ conversation.id } conversation={ conversation } users={ this.props.users } />;
    }).toJS();

    return elements;
  };

  renderCreateConversationPanel = () => {
    return (
      <div className={styles['center-panel']}>
        <ConversationSettingsApp conversationSettingsViewState={this.props.conversationSettingsViewState}/>
      </div>
    );
  };

  renderConversationListPanel = () => {
    const { conversations } = this.props;
    return (
      <div className={styles['center-panel']}>
        <div className={styles["header-container"]}>
          <div className={styles['title']}>
            <Icon type="chat" style={{ marginRight: '20px' }}>TEAMS</Icon>
          </div>
          <div className={styles["action"]}>
            <CreateConversationApp/>
          </div>
        </div>
        <div className={styles['center-panel-list']}>
          { this.conversationElements(conversations) }
        </div>
      </div>
    );
  };

  renderCenterPanel = () => {
    const { conversationSettingsViewState } = this.props;
    if (conversationSettingsViewState === 'create') {
      return this.renderCreateConversationPanel();
    }
    return this.renderConversationListPanel();
  }
  render() {
    const { organization, conversations, agendaItems, visitAgendaItem, deliverables, visitDeliverable, updateDeliverable, updateAgendaItem, currentUser } = this.props;

    return (
      <div className={styles.root} ref="root">
        <ConversationLayout
          left={ <AgendaItemList agendaItems={ agendaItems } visitAgendaItem={ visitAgendaItem } updateAgendaItem={ updateAgendaItem } /> }
          right={ <DeliverableList deliverables={ deliverables } visitDeliverable={ visitDeliverable } updateDeliverable={ updateDeliverable } currentUser={currentUser}/> }
          currentTimeline={'organization'}
        >
          {this.renderCenterPanel()}
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
  conversationSettingsViewState: PropTypes.string.isRequired,
  updateDeliverable: PropTypes.func.isRequired,
  updateAgendaItem: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default OrganizationOverview;
