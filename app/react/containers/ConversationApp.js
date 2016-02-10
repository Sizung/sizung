import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ConversationActions from '../actions/conversations';
import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as selectors from '../utils/selectors';

import ConversationLayoutApp from './ConversationLayoutApp';
import ConversationObjectList from '../components/ConversationObjectList';
import { fillConversation } from '../utils/entityUtils';

class ConversationApp extends React.Component {
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
    this.props.selectConversation(conversationId);
  };

  render() {
    const { conversationObjects, commentForm } = this.props;
    const { parent } = commentForm;

    if (parent) {
      if (conversationObjects) {
        return (
          <ConversationLayoutApp conversationId={parent.id}>
            <ConversationObjectList {...this.props} />
          </ConversationLayoutApp>
        );
      }

      return (
        <ConversationLayoutApp conversationId={parent.id}>
          <div className="text-center"><h5>Loading Conversation...</h5></div>
        </ConversationLayoutApp>
      );
    }

    return <div className="text-center"><h5>Loading Conversation...</h5></div>;
  }
}

function objectsToShow(state, props) {
  return state.getIn(['conversationObjectsByConversation', props.params.conversationId]);
}

function isFetching(state, props) {
  const list = objectsToShow(state, props);
  return list ? list.get('isFetching') : false;
}

function nextPageUrl(state, props) {
  const list = objectsToShow(state, props);
  if (list && parseInt(decodeURIComponent(list.get('nextPageUrl')).split("page[size]=")[1]) !== 0) {
    return list.get('nextPageUrl');
  }
}

function mapStateToProps(state, props) {
  return {
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state, props)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: fillConversation(state, props.params.conversationId),
      canCreateAgendaItem: true,
      canCreateDeliverable: false,
    },
    users: selectors.conversationMembersAsUsers(state, props.params.conversationId),
    canCreateAgendaItem: true,
    canCreateDeliverable: false,
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: props.params.conversationId,
    conversationMembers: selectors.conversationMembers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ConversationActions, ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationApp);
