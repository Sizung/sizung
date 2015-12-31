import { connect } from 'react-redux';
import EditableUser from '../components/EditableUser';

function mapStateToProps(state) {
  var users = state.getIn(['entities', 'users']).toList();

  return {
    users: users
  }
}

export default connect(mapStateToProps)(EditableUser);
