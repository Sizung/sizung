import { connect } from 'react-redux';
import UserList from '../components/UserList/index';

function mapStateToProps(state) {
  return {
    users: state.getIn(['entities', 'users']).toList(),
  };
}

export default connect(mapStateToProps)(UserList);
