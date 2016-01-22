import { connect } from 'react-redux';
import EditableUser from '../components/EditableUser';

function mapStateToProps(state) {
  var users = state.getIn(['entities', 'users']).toList();
  var conversationMemberReferences = state.getIn(['entities', 'conversationMembers']).toList();
  var conversationMembers = new Array();
  users.map(function(user){
    conversationMemberReferences.map(function(conversationMemberReference){
      if ( user.id == conversationMemberReference.memberId ) {
        conversationMembers.push(user);
      }
    });
  });
  return {
    users: conversationMembers
  }
}

export default connect(mapStateToProps)(EditableUser);
