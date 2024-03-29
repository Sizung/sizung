import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from '../components/Spinner';

import * as OrganizationActions from '../actions/organizations';
import * as ConversationActions from '../actions/conversations';
import * as AgendaItemActions from '../actions/agendaItems';
import * as CommentActions from '../actions/comments';
import * as DeliverableActions from '../actions/deliverables';
import * as UnseenObjectsActions from '../actions/unseenObjects';
import * as ConversationObjectsActions from '../actions/conversationObjects';
import * as TimeTrackActions from '../actions/timetracks';
import * as selectors from '../utils/selectors';

import ConversationLayoutApp from './ConversationLayoutApp';
import ConversationObjectList from '../components/ConversationObjectList';
import { fillConversation } from '../utils/entityUtils';
import * as ConversationUiActions from '../actions/conversationUi';
import * as AttachmentActions from '../actions/attachments';
import * as labels from '../utils/entityLabels';

class ConversationApp extends React.Component {
   componentDidMount() {
     this.fetchData(this.props);
   }

   componentWillReceiveProps(properties) {
     if (this.props.params.conversationId !== properties.params.conversationId) {
       this.fetchData(properties);
     }
   }

   fetchData = (properties) => {
     const { conversationId } = properties.params;
     properties.fetchConversation(conversationId);
   };

  render() {
    const { conversationObjects, commentForm, labels } = this.props;
    const { parent } = commentForm;
    const parentConversationId = conversationObjects && conversationObjects.length > 0 ? conversationObjects[0].conversationId || conversationObjects[0].commentableId : undefined;

    if (parent) {
      if (conversationObjects && this.props.params.conversationId === this.props.currentConversation.id
      && (!parentConversationId || parentConversationId === this.props.params.conversationId)) {
        return (
          <ConversationLayoutApp conversationId={parent.id} currentTimeline={'conversation'} labels={labels}>
            <ConversationObjectList {...this.props} />
          </ConversationLayoutApp>
        );
      }

      return (
        <ConversationLayoutApp conversationId={parent.id} currentTimeline={'conversation'} labels={labels}>
          <Spinner />
        </ConversationLayoutApp>
      );
    }

    return <Spinner />;
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
  const conversationSettingsViewState = selectors.conversationSettingsViewState(state);
  return {
    conversationObjects: selectors.conversationObjects(state, objectsToShow(state, props)),
    commentForm: {
      currentUser: selectors.currentUser(state),
      parent: fillConversation(state, props.params.conversationId),
    },
    isFetching: isFetching(state, props),
    nextPageUrl: nextPageUrl(state, props),
    currentConversationId: props.params.conversationId,
    currentConversation: selectors.currentConversation(state),
    conversationMembers: selectors.conversationMembers(state),
    conversationSettingsViewState,
    navigationHistory: selectors.navigationHistory(state),
    labels: labels.organizationObjectsLabels(state),
    deliverables: selectors.deliverablesForConversation(state, props.params.conversationId),
    agendaItems: selectors.agendaItemsList(state, props.params.conversationId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TimeTrackActions, ...ConversationUiActions, ...ConversationActions, ...AgendaItemActions, ...CommentActions, ...DeliverableActions, ...ConversationObjectsActions, ...UnseenObjectsActions, ...AttachmentActions, ...OrganizationActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationApp);
