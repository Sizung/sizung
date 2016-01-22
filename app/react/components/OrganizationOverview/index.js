import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Organization from '../Organization';
import Conversation from '../Conversation';
import AgendaItemList from '../AgendaItemList';
import DeliverableList from '../DeliverableList';
import ConversationLayout from '../ConversationLayout';
import ConversationIcon from '../ConversationIcon';
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
      return <Conversation key={ conversation.id } conversation={ conversation }/>;
    }).toJS();

    return elements;
  };

  render() {
    const { organization, conversations, agendaItems, visitAgendaItem, deliverables, selectDeliverable } = this.props;

    return (
      <div styleName='root' ref='root'>
        <Organization organization={organization} ref='organization'/>
        <ConversationLayout
          left={ <AgendaItemList agendaItems={ agendaItems } visitAgendaItem={ visitAgendaItem } /> }
          right={ <DeliverableList deliverables={ deliverables } selectDeliverable={ selectDeliverable } /> }
        >
          <div styleName='center-panel'>
            <div styleName="header-container">
              <h5 styleName="header">
                <span styleName="action" className="pull-right">
                  <a href={'/organizations/' + organization.id + '/conversations/new'}>
                    <i className="fa fa-plus" />
                    Add Conversation
                  </a>
                </span>
                <ConversationIcon inverted={true} size={'x-large'} style={{ marginRight: '5px' }}/>CONVERSATIONS
              </h5>
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
  selectDeliverable: PropTypes.func.isRequired,
};

export default OrganizationOverview;
