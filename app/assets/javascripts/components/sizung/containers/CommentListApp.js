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
