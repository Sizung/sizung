import { connect } from 'react-redux';
import ConversationLayout from '../components/ConversationLayout';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  return {
    currentConversation: selectors.currentConversation(state),
    currentUser: selectors.currentUser(state),
  };
}

export default connect(mapStateToProps)(ConversationLayout);