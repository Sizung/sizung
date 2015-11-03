// App style container components are there to bind a Component (here CommentList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommentList from '../components/CommentList';
import * as CommentsActions from '../actions/comments';
import * as AgendaItemActions from '../actions/agendaItems';

function mapStateToProps(state) {
  const commentIdsToShow = state.getIn(['commentsByConversation', state.getIn(['currentConversation', 'id'])]);

  var comments = commentIdsToShow.map(function(commentId){
    return state.getIn(['entities', 'comments', commentId]);
  }).toJS();

  return {
    comments: comments,
    currentConversation: state.get('currentConversation')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...AgendaItemActions, ...CommentsActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
