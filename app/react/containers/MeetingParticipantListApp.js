import { connect } from 'react-redux';
import MeetingParticipantList from '../components/MeetingParticipantList';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const currentConversation = state.getIn(['currentConversation']);
  const conversationMembers = selectors.conversationMembersAsUsers(state, currentConversation.get('id'));
  const currentUser = selectors.currentUser(state);
  return {
    conversationMembers,
    currentConversation,
    currentUser,
  };
}

export default connect(mapStateToProps)(MeetingParticipantList);
