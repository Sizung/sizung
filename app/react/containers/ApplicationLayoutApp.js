import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as selectors from '../utils/selectors';
import ApplicationLayout from '../components/ApplicationLayout';

function mapStateToProps(state, props) {
  const conversationId = props.params.conversationId;
  const toasts = new Immutable.List([
    { id: '123', body: 'Someone pinged you on <a href="http://localhost:3000/">PRODUCT</a>' },
    { id: '456', body: 'Something else' },
  ]);

  return {
    organizations: selectors.organizations(state),
    currentOrganization: selectors.currentOrganization(state),
    currentConversation: selectors.conversation(state, conversationId),
    currentUser: selectors.currentUser(state),
    users: selectors.conversationMembers(state),
    toasts,
  };
}

export default connect(mapStateToProps)(ApplicationLayout);
