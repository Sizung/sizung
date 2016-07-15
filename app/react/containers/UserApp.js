import { connect } from 'react-redux';
import User from '../components/User';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  return {
    currentUser: selectors.currentUser(state),
  };
}

export default connect(mapStateToProps)(User);
