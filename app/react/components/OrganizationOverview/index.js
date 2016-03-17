import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Organization from '../Organization';
import Conversation from '../Conversation';
import AgendaItemList from '../AgendaItemList';
import DeliverableList from '../DeliverableList';
import ConversationLayout from '../ConversationLayout';
import ChatIcon from '../ChatIcon';
import PlusIcon from '../PlusIcon';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class OrganizationOverview extends Component {
  constructor() {
    super();

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.handleResize();
  }

  handleResize() {
    const organizationNode = ReactDOM.findDOMNode(this.refs.organization);
    const rootNode = this.refs.root;
    if (organizationNode && rootNode) {
      $(rootNode).css('padding-bottom',$(organizationNode).outerHeight(true)+'px');
    }
  }
  conversationElements = (conversations) => {
    const elements = conversations.map((conversation) => {
      return <Conversation key={ conversation.id } conversation={ conversation } users={ this.props.users }/>;
    }).toJS();

    return elements;
  };

  render() {
    const { organization, conversations, agendaItems, visitAgendaItem, deliverables, visitDeliverable } = this.props;

    return (
      <div styleName='root' ref='root'>
        <Organization organization={organization} ref='organization'/>
        <ConversationLayout
          left={ <AgendaItemList agendaItems={ agendaItems } visitAgendaItem={ visitAgendaItem } /> }
          right={ <DeliverableList deliverables={ deliverables } visitDeliverable={ visitDeliverable } /> }
        >
          <div styleName='center-panel'>
            <div styleName="header-container">
              <div styleName='title'>
                <ChatIcon inverted={true} style={{ marginRight: '20px' }} size={'large'}/>CONVERSATIONS
              </div>
              <div styleName="action">
                <a href={'/organizations/' + organization.id + '/conversations/new'}>
                  <PlusIcon/>
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
  users: PropTypes.object.isRequired
};

export default OrganizationOverview;
