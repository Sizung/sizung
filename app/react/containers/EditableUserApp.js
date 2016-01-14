import { connect } from 'react-redux';
import EditableUser from '../components/EditableUser';
import * as selectors from '../utils/selectors';

function mapStateToProps(state, props) {
  const { conversationId } = props;
  return {
    users: selectors.conversationMembersAsUsers(state, conversationId),
  };
}

export default connect(mapStateToProps)(EditableUser);
