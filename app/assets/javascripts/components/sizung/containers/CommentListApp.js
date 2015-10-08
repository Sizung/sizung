// App style container components are there to bind a Component (here CommentList) to
// the actions they can call and to which part of the state tree they are interested in.
// When the part of the state tree that they are interested in is changed, they get re-rendered.

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommentList from '../components/CommentList';
import * as CommentsActions from '../actions/comments';

function mapStateToProps(state) {
  return {
    comments: state.comments
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CommentsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
