import { connect } from 'react-redux';
import * as selectors from '../utils/selectors';
import ApplicationLayout from '../components/ApplicationLayout';

function mapStateToProps(state, props) {
  const conversationId = props.params.conversationId;

  return {
    organizations: selectors.organizations(state),
    currentOrganization: selectors.currentOrganization(state),
    currentConversation: selectors.conversation(state, conversationId),
    currentUser: selectors.currentUser(state),
    users: selectors.conversationMembers(state),
  };
}

export default connect(mapStateToProps)(ApplicationLayout);
