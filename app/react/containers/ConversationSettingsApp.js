import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationSettings from '../components/ConversationSettings';
import * as ConversationMemberActions from '../actions/conversationMembers';
import * as ConversationActions from '../actions/conversations';
import * as ConversationUiActions from '../actions/conversationUi';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const organizationMembers = selectors.currentOrganizationMembers(state).toList();
  const currentConversation = selectors.currentConversation(state);

  const currentOrganization = selectors.currentOrganization(state);
  const currentUser = selectors.currentUser(state);
  if (currentConversation) {
    const conversationMembersAsUsers = selectors.conversationMembersAsUsers(state, currentConversation.id).toList();
    const conversationMembers = selectors.conversationMembers(state, currentConversation.id).toList();
    return {
      organizationMembers,
      conversationMembers,
      conversationMembersAsUsers,
      currentConversation,
      currentOrganization,
      currentUser,
    };
  }
  return {
    organizationMembers,
    currentOrganization,
    currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationMemberActions, ...ConversationUiActions, ...ConversationActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationSettings);
