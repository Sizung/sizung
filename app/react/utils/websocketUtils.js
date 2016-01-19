import { createCommentRemoteOrigin, updateCommentRemoteOrigin, deleteCommentRemoteOrigin } from '../actions/comments';
import { createAgendaItemRemoteOrigin, updateAgendaItemRemoteOrigin } from '../actions/agendaItems';
import { createUnseenObjectRemoteOrigin, deleteUnseenObjectRemoteOrigin } from '../actions/unseenObjects';
import { transformObjectFromJsonApi, transformUnseenObjectFromJsonApi, transformAgendaItemFromJsonApi, transformCommentFromJsonApi, transformDeliverableFromJsonApi } from '../utils/jsonApiUtils';
import { createDeliverableRemoteOrigin, updateDeliverableRemoteOrigin } from '../actions/deliverables';
import { updateUserRemoteOrigin } from '../actions/users';

const setupWebSocket = (store) => {
  window.App.comments.setOnReceived((data) => {
    // noinspection JSUnresolvedVariable
    if (store.getState().getIn(['currentUser', 'id']) !== data.actor_id) {
      if (data.action === 'create') {
        store.dispatch(createCommentRemoteOrigin(transformCommentFromJsonApi(data.payload.data)));
      } else if (data.action === 'update') {
        store.dispatch(updateCommentRemoteOrigin(transformCommentFromJsonApi(data.payload.data)));
      } else if (data.action === 'delete') {
        store.dispatch(deleteCommentRemoteOrigin(transformCommentFromJsonApi(data.payload.data)));
      }
    }
  });

  window.App.userChannel.setOnReceived((data) => {
    if (data.payload.data.type === 'unseen_objects') {
      if (data.action === 'create') {
        store.dispatch(createUnseenObjectRemoteOrigin(transformUnseenObjectFromJsonApi(data.payload.data)));
      } else if (data.action === 'delete') {
        store.dispatch(deleteUnseenObjectRemoteOrigin(transformUnseenObjectFromJsonApi(data.payload.data)));
      }
    }
    // store.dispatch(updateUserRemoteOrigin(data.user));
  });

  window.App.appearance.setOnReceived((data) => {
    store.dispatch(updateUserRemoteOrigin(transformObjectFromJsonApi(data.user.data)));
  });

  window.App.agenda_items.setOnReceived((data) => {
    // noinspection JSUnresolvedVariable
    if (store.getState().getIn(['currentUser', 'id']) !== data.actor_id) {
      if (data.action === 'create') {
        store.dispatch(createAgendaItemRemoteOrigin(transformAgendaItemFromJsonApi(data.payload.data)));
      } else if (data.action === 'update') {
        store.dispatch(updateAgendaItemRemoteOrigin(transformAgendaItemFromJsonApi(data.payload.data)));
      }
    }
  });

  window.App.deliverables.setOnReceived((data) => {
    // noinspection JSUnresolvedVariable
    if (store.getState().getIn(['currentUser', 'id']) !== data.actor_id) {
      if (data.action === 'create') {
        store.dispatch(createDeliverableRemoteOrigin(transformDeliverableFromJsonApi(data.payload.data)));
      } else if (data.action === 'update') {
        store.dispatch(updateDeliverableRemoteOrigin(transformDeliverableFromJsonApi(data.payload.data)));
      }
    }
  });
};

export {
  setupWebSocket,
}