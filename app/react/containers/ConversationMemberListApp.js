import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationMemberList from '../components/ConversationMemberList/index';
import * as ConversationMemberActions from '../actions/conversationMembers';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const organizationMembers =  selectors.organizationMembers(state).toList();
  const currentConversation = state.getIn(['currentConversation']);
  const conversationMembers = selectors.conversationMembers(state).toList();
  return {
    organizationMembers,
    conversationMembers,
    currentConversation,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationMemberActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMemberList);
