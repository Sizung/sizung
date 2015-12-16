import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationMemberList from '../components/ConversationMemberList/index';
import * as ConversationMemberActions from '../actions/conversationMembers';
import Immutable from 'immutable';

function mapStateToProps(state) {
  var organizationMembers = state.getIn(['entities', 'users']).toList();
  var conversationMembers = state.getIn(['entities', 'conversationMembers']).toList();
  console.log("conversation member map: " + JSON.stringify(conversationMembers));
  var currentConversation = state.getIn(['currentConversation']);

  return {
    organizationMembers: organizationMembers,
    conversationMembers: conversationMembers,
    currentConversation: currentConversation

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...ConversationMemberActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationMemberList);
