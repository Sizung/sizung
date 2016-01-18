import React, { Component, PropTypes } from 'react';

import Organization from '../Organization';
import Conversation from '../Conversation';
import AgendaItemList from '../AgendaItemList';
import DeliverableList from '../DeliverableList';
import ConversationLayout from '../ConversationLayout';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class OrganizationOverview extends Component {
  conversationElements = (conversations) => {
    const elements = conversations.map((conversation) => {
      return <Conversation key={ conversation.id } conversation={ conversation }/>;
    }).toJS();

    return elements;
  };

  render() {
    const { organization, conversations, agendaItems, visitAgendaItem, deliverables, selectDeliverable } = this.props;

    return (
      <div styleName='root'>
        <Organization organization={organization}/>
        <ConversationLayout
          left={ <AgendaItemList agendaItems={ agendaItems } visitAgendaItem={ visitAgendaItem } /> }
          right={ <DeliverableList deliverables={ deliverables } selectDeliverable={ selectDeliverable } /> }
        >
          <div styleName='header'>
            <h5 style={{ margin: '5px', fontWeight: 'bold' }}>
              <span className='pull-right'>
                <a href={'/organizations/' + organization.id + '/conversations/new'}>
                  <i className="fa fa-plus" />
                  Add Conversation
                </a>
              </span>
              CONVERSATIONS
            </h5>
          </div>
          { this.conversationElements(conversations) }
        </ConversationLayout>
      </div>
    );
  }


  //render() {
  //  const { organization, conversations, agendaItems, visitAgendaItem, deliverables, selectDeliverable } = this.props;
  //
  //  return (
  //    <div>
  //      <div>
  //        <Organization organization={organization}/>
  //      </div>
  //      <div className="row" styleName="root">
  //        <div className="col-sm-3" styleName="left-panel">
  //          <AgendaItemList agendaItems={ agendaItems } visitAgendaItem={ visitAgendaItem } />
  //        </div>
  //        <div className="col-xs-12 col-sm-6" styleName="center-panel">
  //          <div styleName='header'>
  //            <h5 style={{margin: '5px', fontWeight: 'bold'}}>
  //              <span className='pull-right'>
  //                <a href={'/organizations/' + organization.id + '/conversations/new'}>
  //                  <i className="fa fa-plus" />
  //                  Add Conversation
  //                </a>
  //              </span>
  //              CONVERSATIONS
  //            </h5>
  //          </div>
  //          { this.conversationElements(conversations) }
  //        </div>
  //        <div className="col-sm-3" styleName="right-panel">
  //          <DeliverableList deliverables={ deliverables } selectDeliverable={ selectDeliverable } />
  //        </div>
  //      </div>
  //    </div>
  //  );
  //}
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
