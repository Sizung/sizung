import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreateConversation from '../components/CreateConversation/CreateConversation';
import * as ConversationUiActions from '../actions/conversationUi';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const conversationSettingsViewState = selectors.conversationSettingsViewState(state);
  return {
    conversationSettingsViewState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationUiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConversation);
