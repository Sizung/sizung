import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as OrganizationActions from '../actions/organizations';
import * as ConversationActions from '../actions/conversations';
import * as AgendaItemActions from '../actions/agendaItems';
import * as DeliverableActions from '../actions/deliverables';
import * as selectors from '../utils/selectors';

import OrganizationOverview from '../components/OrganizationOverview';

class OrganizationApp extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.organizationId !== prevProps.params.organizationId) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { organizationId } = this.props.params;
    this.props.selectOrganization(organizationId);
  };

  render() {
    const { organization, conversations, agendaItems, deliverables, visitAgendaItem, selectDeliverable } = this.props;

    if (organization && conversations) {
      return (
        <OrganizationOverview
          organization={organization}
          conversations={conversations}
          agendaItems={agendaItems || new Immutable.List()}
          deliverables={deliverables || new Immutable.List()}
          visitAgendaItem={visitAgendaItem}
          selectDeliverable={selectDeliverable}
        />
      );
    }
    return <div className="text-center"><h5>Loading Organization...</h5></div>;
  }
}

function mapStateToProps(state, props) {
  return {
    organization: selectors.organization(state, props.params.organizationId),
    conversations: selectors.conversationsForOrganization(state, props.params.organizationId),
    agendaItems: selectors.agendaItemsForOrganization(state, props.params.organizationId),
    deliverables: selectors.deliverablesForOrganization(state, props.params.organizationId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...OrganizationActions, ...ConversationActions, ...AgendaItemActions, ...DeliverableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationApp);
