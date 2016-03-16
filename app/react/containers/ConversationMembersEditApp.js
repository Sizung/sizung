import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationMembersEdit from '../components/ConversationMembersEdit';
import * as ConversationMemberActions from '../actions/conversationMembers';
import * as ConversationUiActions from '../actions/conversationUi';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const organizationMembers = selectors.organizationMembers(state);
  const currentConversation = state.getIn(['currentConversation']);
  const conversationMembers = selectors.conversationMembers(state);
  return {
    organizationMembers,
    conversationMembers,
    currentConversation,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationMemberActions, ...ConversationUiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMembersEdit);
