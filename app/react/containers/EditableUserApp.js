import { connect } from 'react-redux';
import EditableUser from '../components/EditableUser';
import * as selectors from '../utils/selectors';

function mapStateToProps(state, props) {
  const { conversationId, userId, user } = props;

  return {
    users: selectors.conversationMembersAsUsers(state, conversationId),
    user: user || selectors.user(state, userId),
  };
}

export default connect(mapStateToProps)(EditableUser);
