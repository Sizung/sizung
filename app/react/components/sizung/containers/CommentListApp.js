// App style container components are there to bind a Component (here CommentList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommentList from '../components/CommentList';
import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';

function mapStateToProps(state) {
  const objectsToShow = state.getIn(['conversationObjectsByConversation', state.getIn(['currentConversation', 'id'])]);

  var conversationObjects = objectsToShow.map(function(objectReference){
    const {id, type} = objectReference;

    var conversationObject = state.getIn(['entities', type, id]);
    if (conversationObject.type === 'agendaItems') {
      conversationObject.conversation = state.getIn(['entities', 'conversations', conversationObject.conversationId]);
      conversationObject.commentsSize = 0;
      conversationObject.owner = state.getIn(['entities', 'users', conversationObject.ownerId]);
    }
    else if (conversationObject.type === 'comments') {
      conversationObject.author = state.getIn(['entities', 'users', conversationObject.authorId]);
    }
    return conversationObject;
  }).toJS();

  const currentUser = state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);

  return {
    conversationObjects: conversationObjects,
    currentConversation: state.get('currentConversation'),
    currentUser: currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions, ...CommentsActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
