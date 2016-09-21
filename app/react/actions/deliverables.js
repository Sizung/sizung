import { routeActions } from 'redux-simple-router';
import * as constants from './constants';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import * as ComposerUiActions from './composerUi';

const updateDeliverable = (id, changedFields) => {
  return (dispatch) => {
    api.putJson('/api/deliverables/' + id, { deliverable: changedFields }, (json) => {
      const deliverable = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.UPDATE_DELIVERABLE,
        status: constants.STATUS_SUCCESS,
        deliverable,
        entity: deliverable,
      });
      if (changedFields.archived) {
        dispatch(routeActions.push(
          '/' + transform.reverseTransformTypeFromJsonApi(deliverable.parentType) +  '/' + deliverable.parentId
        ));
      }
    });
  };
};

const updateDeliverableRemoteOrigin = (deliverable) => {
  return {
    type: constants.UPDATE_DELIVERABLE,
    status: constants.STATUS_REMOTE_ORIGIN,
    deliverable,
    entity: deliverable,
  };
};

const archiveDeliverable = (id) => {
  if (confirm('Are you sure you want to archive this Deliverable?')) {
    return updateDeliverable(id, { archived: true });
  }
  return null;
};

const deleteDeliverables = (deliverables) => {
  return {
    type: constants.DELETE_ALL_DELIVERABLES,
    status: constants.STATUS_SUCCESS,
    deliverables,
  };
};

const fetchDeliverable = (deliverableId) => {
  return (dispatch, getState) => {
    api.fetchJson('/api/deliverables/' + deliverableId, (json) => {
      const included = json.included ? json.included.map(transform.transformObjectFromJsonApi) : null;
      const deliverable = transform.transformObjectFromJsonApi(json.data);

      dispatch({
        type: constants.FETCH_DELIVERABLE,
        verb: 'FETCH',
        status: constants.STATUS_SUCCESS,
        deliverable,
        included,
        entity: deliverable,
        entities: included,
      });
    });

    // fetch objects if not already there
    //if (!getState().getIn(['conversationObjectsByDeliverable', deliverableId])) {
      api.fetchJson('/api/deliverables/' + deliverableId + '/conversation_objects', (json) => {
        const conversationObjects = json.data.map(transform.transformObjectFromJsonApi);

        dispatch({
          type: constants.FETCH_CONVERSATION_OBJECTS,
          status: constants.STATUS_SUCCESS,
          parentReference: { type: 'deliverables', id: deliverableId },
          conversationObjects,
          links: json.links,
          entities: conversationObjects,
        });
      });
    //}
  };
};

const createDeliverableRemoteOrigin = (deliverable) => {
  return {
    type: constants.CREATE_DELIVERABLE,
    status: constants.STATUS_REMOTE_ORIGIN,
    deliverable,
    entity: deliverable,
  };
};

const visitDeliverable = (deliverableId) => {
  return (dispatch) => {
    dispatch(routeActions.push('/deliverables/' + deliverableId));
    dispatch(ComposerUiActions.resetComposerState());
  };
};

const createDeliverable = (values) => {
  switch (values.source_timeline.type) {
    case 'conversations':
      values.source_timeline.type = 'Conversation';
      break;
    case 'agendaItems':
      values.source_timeline.type = 'AgendaItem';
      break;
    case 'deliverables':
      values.source_timeline.type = 'Deliverable';
      break;
    default:
      values.source_timeline.type = 'Undefined';
  }
  return (dispatch) => {
    api.postJson('/api/deliverables', { deliverable: values, source_timeline: values.source_timeline }, (json) => {
      const deliverable = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.CREATE_DELIVERABLE,
        status: constants.STATUS_SUCCESS,
        deliverable,
        entity: deliverable,
      });
      dispatch(routeActions.push('/deliverables/' + deliverable.id));
    });
  };
};

export {
  visitDeliverable,
  fetchDeliverable,
  archiveDeliverable,
  createDeliverable,
  updateDeliverable,
  createDeliverableRemoteOrigin,
  updateDeliverableRemoteOrigin,
  deleteDeliverables,
};
