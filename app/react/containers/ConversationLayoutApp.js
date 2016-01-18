import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationLayout from '../components/ConversationLayout';
import * as selectors from '../utils/selectors';
import * as ConversationActions from '../actions/conversations';

class ConversationLayoutApp extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.conversationId !== prevProps.params.conversationId) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { conversationId } = this.props.params;
    this.props.fetchConversation(conversationId);
  };

  render() {
    return <ConversationLayout {...this.props} />;
  }
}

ConversationLayoutApp.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fetchConversation: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: selectors.currentUser(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationLayoutApp);