import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationMembersCounter from '../components/ConversationMembersCounter/ConversationMembersCounter';
import * as ConversationMemberActions from '../actions/conversationMembers';
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
  return bindActionCreators({ ...ConversationMemberActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMembersCounter);
