import { connect } from 'react-redux';
import EditableUser from '../components/EditableUser';
import Immutable from 'immutable';

function mapStateToProps(state) {
  const users = state.getIn(['entities', 'users']).toList();
  const conversationMemberReferences = state.getIn(['entities', 'conversationMembers']).toList();
  let conversationMembers = new Immutable.List();

  users.map((user) => {
    conversationMemberReferences.map((conversationMemberReference) => {
      if (user.id === conversationMemberReference.memberId) {
        conversationMembers = conversationMembers.push(user);
      }
    });
  });
  return {
    users: conversationMembers,
  };
}

export default connect(mapStateToProps)(EditableUser);
