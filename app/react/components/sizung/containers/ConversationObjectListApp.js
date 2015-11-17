// App style container components are there to bind a Component (here ConversationObjectList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ConversationObjectList from '../components/ConversationObjectList';
import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';
import { fetchConversationObjects } from '../actions/conversationObjects';
import { fillConversationObject } from '../utils/entityUtils';

function mapStateToProps(state) {
  const objectsToShow = state.getIn(['conversationObjectsByConversation', state.getIn(['currentConversation', 'id'])]);

  var conversationObjects;
  var nextPageUrl;

  if (objectsToShow) {
    conversationObjects = objectsToShow.get('references').map(function(objectReference){
      return fillConversationObject(state, objectReference);
    }).reverse().toJS();

    nextPageUrl = objectsToShow.get('nextPageUrl');
  }

  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);

  const currentConversation = state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);

  return {
    conversationObjects: conversationObjects,
    currentConversation: currentConversation,
    currentUser: currentUser,
    nextPageUrl: nextPageUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions, ...CommentsActions, fetchConversationObjects}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationObjectList);
