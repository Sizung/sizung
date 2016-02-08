import { connect } from 'react-redux';
import * as selectors from '../utils/selectors';
import ApplicationLayout from '../components/ApplicationLayout';

function mapStateToProps(state, props) {
  return {
    organizations: selectors.organizations(state),
    currentOrganization: selectors.currentOrganization(state),
    // TODO: This is a quick fix due to broken visual hierarchy. Do it the clean way when the visual hierarchy is corrected.
    currentConversation: props.params.organizationId ? null : selectors.currentConversation(state),
    currentUser: selectors.currentUser(state),
    users: selectors.conversationMembers(state),
  };
}

export default connect(mapStateToProps)(ApplicationLayout);
