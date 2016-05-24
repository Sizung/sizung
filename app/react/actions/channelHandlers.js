import * as agendaItems from './agendaItems';
import * as comments from './comments';
import * as deliverables from './deliverables';
import * as conversations from './conversations';
import * as users from './users';
import * as organizationMembers from './organizationMembers';
import * as unseenObjects from './unseenObjects';
import * as transform from '../utils/jsonApiUtils';

const onUserChannelReceived = (data) => {
  return (dispatch) => {
    if (data.payload.data.type === 'unseen_objects') {
      if (data.action === 'create' || data.action === 'update') {
        dispatch(unseenObjects.createUnseenObjectRemoteOrigin(transform.transformUnseenObjectFromJsonApi(data.payload.data)));
      } else if (data.action === 'delete') {
        dispatch(unseenObjects.deleteUnseenObjectRemoteOrigin(transform.transformUnseenObjectFromJsonApi(data.payload.data)));
      }
    }
    // store.dispatch(updateUserRemoteOrigin(data.user));
  };
};

const onOrganizationChannelReceived = (data) => {
  return (dispatch) => {
    if (data.user) {
      dispatch(users.updateUserRemoteOrigin(transform.transformObjectFromJsonApi(data.user.data)));
    } else if (data.organization_member) {
      const includedEntities = data.organization_member.included.map(transform.transformObjectFromJsonApi);
      dispatch(organizationMembers.createOrganizationMemberRemoteOrigin(transform.transformObjectFromJsonApi(data.organization_member.data), includedEntities));
    }
  };
};

const onConversationChannelReceived = (data) => {
  return (dispatch) => {
    if (data.payload.data.type === 'agenda_items') {
      if (data.action === 'create') {
        dispatch(agendaItems.createAgendaItemRemoteOrigin(transform.transformAgendaItemFromJsonApi(data.payload.data)));
      } else if (data.action === 'update') {
        dispatch(agendaItems.updateAgendaItemRemoteOrigin(transform.transformAgendaItemFromJsonApi(data.payload.data)));
      }
    } else if (data.payload.data.type === 'comments') {
      if (data.action === 'create') {
        dispatch(comments.createCommentRemoteOrigin(transform.transformCommentFromJsonApi(data.payload.data)));
      } else if (data.action === 'update') {
        dispatch(comments.updateCommentRemoteOrigin(transform.transformCommentFromJsonApi(data.payload.data)));
      } else if (data.action === 'delete') {
        dispatch(comments.deleteCommentRemoteOrigin(transform.transformCommentFromJsonApi(data.payload.data)));
      }
    } else if (data.payload.data.type === 'deliverables') {
      if (data.action === 'create') {
        dispatch(deliverables.createDeliverableRemoteOrigin(transform.transformDeliverableFromJsonApi(data.payload.data)));
      } else if (data.action === 'update') {
        dispatch(deliverables.updateDeliverableRemoteOrigin(transform.transformDeliverableFromJsonApi(data.payload.data)));
      }
    } else if (data.payload.data.type === 'conversations') {
      if (data.action === 'update') {
        const includedEntities = data.payload.included.map(transform.transformObjectFromJsonApi);
        dispatch(conversations.updateConversationRemoteOrigin(transform.transformConversationFromJsonApi(data.payload.data), includedEntities));
      }
    }
  };
};

export {
  onUserChannelReceived,
  onOrganizationChannelReceived,
  onConversationChannelReceived,
};
