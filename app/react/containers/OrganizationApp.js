import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as OrganizationActions from '../actions/organizations';
import * as ConversationActions from '../actions/conversations';
import * as AgendaItemActions from '../actions/agendaItems';
import * as DeliverableActions from '../actions/deliverables';
import * as channelHandlers from '../actions/channelHandlers';
import * as selectors from '../utils/selectors';
import * as ws from '../utils/websocketUtils';

import OrganizationOverview from '../components/OrganizationOverview';

class OrganizationApp extends React.Component {
  componentDidMount() {
    const { onOrganizationChannelReceived } = this.props;
    const { organizationId } = this.props.params;

    this.fetchData();
    ws.followOrganizationChannel(organizationId, onOrganizationChannelReceived);
  }

  componentDidUpdate(prevProps) {
    const { onOrganizationChannelReceived } = this.props;
    const organizationId = this.props.params.organizationId;

    if (organizationId !== prevProps.params.organizationId) {
      this.fetchData();
      ws.followOrganizationChannel(organizationId, onOrganizationChannelReceived);
    }
  }

  componentWillUnmount() {
    ws.unfollowOrganizationChannel();
  }

  fetchData = () => {
    const { organizationId } = this.props.params;
    this.props.selectOrganization(organizationId);
  };

  render() {
    const { organization, conversations, agendaItems, deliverables, visitAgendaItem, visitDeliverable, users } = this.props;

    if (organization && conversations) {
      return (
        <OrganizationOverview
          organization={organization}
          conversations={conversations}
          agendaItems={agendaItems || new Immutable.List()}
          deliverables={deliverables || new Immutable.List()}
          visitAgendaItem={visitAgendaItem}
          visitDeliverable={visitDeliverable}
          users={users}
        />
      );
    }
    return <div className="text-center"><h5>Loading Organization...</h5></div>;
  }
}

OrganizationApp.propTypes = {
  onOrganizationChannelReceived: PropTypes.func.isRequired,
  organization: PropTypes.object,
  conversations: PropTypes.object,
};

function mapStateToProps(state, props) {
  return {
    organization: selectors.organization(state, props.params.organizationId),
    conversations: selectors.conversationsForOrganization(state, props.params.organizationId),
    agendaItems: selectors.agendaItemsForOrganization(state, props.params.organizationId),
    deliverables: selectors.deliverablesForOrganization(state, props.params.organizationId),
    users: selectors.users(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...OrganizationActions,
    ...ConversationActions,
    ...AgendaItemActions,
    ...DeliverableActions,
    ...channelHandlers,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationApp);
