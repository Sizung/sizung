import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as selectors from '../utils/selectors';
import Settings from '../components/Settings';

import * as OrganizationActions from '../actions/organizations';
import * as UserActions from '../actions/users';
import * as OrganizationMemberActions from '../actions/organizationMembers';
import * as channelHandlers from '../actions/channelHandlers';
import * as ws from '../utils/websocketUtils';

class SettingsApp extends React.Component {

  componentDidMount() {
    const { onOrganizationChannelReceived } = this.props;
    const { organizationId } = this.props.params;

    this.fetchData();
    ws.followOrganizationChannel(organizationId, onOrganizationChannelReceived);
  }

  componentDidUpdate(prevProps) {
    const { onOrganizationChannelReceived } = this.props;
    const { organizationId } = this.props.params;

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
    const { organizations, currentOrganization, currentUser, users, organizationMembers } = this.props;
      return (
         <Settings organizations={organizations} currentOrganization={currentOrganization} currentUser={currentUser} users={users} organizationMembers={organizationMembers} {...this.props}/>
      );
  }
}

SettingsApp.propTypes = {
  organizations: PropTypes.object,
  currentOrganization: PropTypes.object,
  currentUser: PropTypes.object,
  users: PropTypes.object,
  organizationMembers: PropTypes.object,
};

function mapStateToProps(state, props) {
  return {
    organizations: selectors.organizations(state),
    currentOrganization: selectors.currentOrganization(state),
    currentUser: selectors.currentUser(state),
    users: selectors.conversationMembers(state),
    organizationMembers: selectors.currentOrganizationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...OrganizationActions,
    ...UserActions,
    ...OrganizationMemberActions,
    ...channelHandlers,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsApp);