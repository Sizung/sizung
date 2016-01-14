// App style container components are there to bind a Component (here ConversationObjectList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ConversationObjectList from '../components/ConversationObjectList/index';
import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import { fetchConversationObjects } from '../actions/conversationObjects';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions, ...CommentsActions, ...DeliverableActions, fetchConversationObjects, ...UnseenObjectsActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationObjectList);
