import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationLayout from '../components/ConversationLayout';
import * as selectors from '../utils/selectors';
import * as ConversationActions from '../actions/conversations';
import * as ws from '../utils/websocketUtils';
import * as channelHandlers from '../actions/channelHandlers';

class ConversationLayoutApp extends React.Component {
  componentDidMount() {
    const { currentUser, onConversationChannelReceived, onOrganizationChannelReceived, conversation } = this.props;
    const { conversationId } = this.props;

    this.fetchData();
    ws.followConversationChannel(conversationId, currentUser.id, onConversationChannelReceived);
    if (conversation) {
      ws.followOrganizationChannel(conversation.organizationId, onOrganizationChannelReceived);
    }
  }

  componentDidUpdate(prevProps) {
    const { currentUser, onConversationChannelReceived, onOrganizationChannelReceived, conversation } = this.props;
    const conversationId = this.props.conversationId;

    if (conversationId !== prevProps.conversationId) {
      this.fetchData();
      ws.followConversationChannel(conversationId, currentUser.id, onConversationChannelReceived);
    }

    if (conversation && conversationId !== prevProps.conversationId) {
      ws.followOrganizationChannel(conversation.organizationId, onOrganizationChannelReceived);
    }
  }

  componentWillUnmount() {
    ws.unfollowConversationChannel();
  }

  fetchData = () => {
    const { conversationId } = this.props;
    this.props.fetchConversation(conversationId);
  };

  render() {
    return <ConversationLayout {...this.props} />;
  }
}

ConversationLayoutApp.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fetchConversation: PropTypes.func.isRequired,
  onConversationChannelReceived: PropTypes.func.isRequired,
  conversation: PropTypes.object,
};

function mapStateToProps(state, props) {
  return {
    currentUser: selectors.currentUser(state),
    conversation: selectors.conversation(state, props.conversationId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationActions, ...channelHandlers }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationLayoutApp);