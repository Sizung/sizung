import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConversationLayout from '../components/ConversationLayout';
import * as selectors from '../utils/selectors';
import * as ConversationActions from '../actions/conversations';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ws from '../utils/websocketUtils';
import * as channelHandlers from '../actions/channelHandlers';

class ConversationLayoutApp extends React.Component {
  componentDidMount() {
    const {
      currentUser,
      conversation,
      conversationId,
      onConversationChannelReceived,
      onOrganizationChannelReceived,
    } = this.props;
    this.props.fetchUnseenObjects('users', this.props.currentUser.id);
    ws.followConversationChannel(conversationId, currentUser.id, onConversationChannelReceived);
    ws.followOrganizationChannel(conversation.organizationId, onOrganizationChannelReceived);
  }

  componentWillReceiveProps(properties) {
    const {
      currentUser,
      conversation,
      conversationId,
      onConversationChannelReceived,
      onOrganizationChannelReceived,
    } = properties;

    if (this.props.conversationId !== properties.conversationId) {
      ws.followConversationChannel(conversationId, currentUser.id, onConversationChannelReceived);
    }
  }

  componentWillUnmount() {
    ws.unfollowConversationChannel();
    ws.unfollowOrganizationChannel();
  }

  render() {
    return <ConversationLayout {...this.props} />;
  }
}

ConversationLayoutApp.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fetchConversation: PropTypes.func.isRequired,
  onConversationChannelReceived: PropTypes.func.isRequired,
  conversation: PropTypes.object,
  fetchUnseenObjects: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    currentUser: selectors.currentUser(state),
    conversation: selectors.conversation(state, props.conversationId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationActions, ...channelHandlers, ...UnseenObjectsActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationLayoutApp);
