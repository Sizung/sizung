import { connect } from 'react-redux';
import Immutable from 'immutable';
import SizungInput from '../components/SizungInput/SizungInput.jsx';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const currentConversation = selectors.currentConversation(state);
  let users = currentConversation ? selectors.conversationMembersAsUsers(state, currentConversation.id) : new Immutable.List();
  users = users.map((user) => { return { id: user.id, display: user.name }; });
  return {
    users,
  };
}

export default connect(mapStateToProps)(SizungInput);
