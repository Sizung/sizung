import { connect } from 'react-redux';
import Immutable from 'immutable';
import Composer from '../components/Composer';
import * as selectors from '../utils/selectors';

function mapStateToProps(state) {
  const currentConversation = selectors.currentConversation(state);
  let mentions = currentConversation ? selectors.conversationMembersAsUsers(state, currentConversation.id) : new Immutable.List();
  mentions = mentions.map((user) => { return { id: user.id, name: user.name, avatar: 'not used yet' }; });
  return {
    mentions: mentions.toJS(),
  };
}

export default connect(mapStateToProps)(Composer);
