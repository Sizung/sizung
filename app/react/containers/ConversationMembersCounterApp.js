import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationMembersCounter from '../components/ConversationMembersCounter/ConversationMembersCounter';
import * as ConversationMemberActions from '../actions/conversationMembers';
import * as ConversationUiActions from '../actions/conversationUi';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const conversationMembers = selectors.conversationMembers(state);
  return {
    conversationMembers,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationMemberActions, ...ConversationUiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMembersCounter);
