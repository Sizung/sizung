import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationSettings from '../components/ConversationSettings';
import * as ConversationMemberActions from '../actions/conversationMembers';
import * as ConversationActions from '../actions/conversations';
import * as ConversationUiActions from '../actions/conversationUi';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const organizationMembers = selectors.currentOrganizationMembers(state);
  const currentConversation = state.getIn(['currentConversation']);
  const conversationMembers = selectors.conversationMembers(state);
  return {
    organizationMembers,
    conversationMembers,
    currentConversation,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationMemberActions, ...ConversationUiActions, ...ConversationActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationSettings);
