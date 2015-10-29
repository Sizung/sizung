import { connect } from 'react-redux';
import UserList from '../components/UserList';

function mapStateToProps(state) {
  var users = state.getIn(['entities', 'users']).toList();

  return {
    users: users
  }
}

export default connect(mapStateToProps)(UserList);
