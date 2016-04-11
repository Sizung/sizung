import { connect } from 'react-redux';
import * as selectors from '../utils/selectors';
import Settings from '../components/Settings';

function mapStateToProps(state, props) {
  return {
    organizations: selectors.organizations(state),
    currentOrganization: selectors.currentOrganization(state),
    currentUser: selectors.currentUser(state),
    users: selectors.conversationMembers(state),
  };
}

export default connect(mapStateToProps)(Settings);
