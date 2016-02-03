import * as constants from './constants';
import { routeActions } from 'redux-simple-router';

import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';

const fetchObjects = (deliverableId, dispatch) => {
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
};

const fetchDeliverable = (deliverableId, dispatch) => {
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
};

const updateDeliverable = (id, changedFields) => {
  return (dispatch) => {
    api.postJson('/api/deliverables/' + id, { deliverble: changedFields }, (json) => {
      const deliverable = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.UPDATE_DELIVERABLE,
        status: constants.STATUS_SUCCESS,
        deliverable,
        entity: deliverable,
      });
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
  return updateDeliverable(id, { archived: true });
};

const selectDeliverable = (deliverableId) => {
  return (dispatch, getState) => {
    fetchDeliverable(deliverableId, dispatch);

    if (!getState().getIn(['conversationObjectsByDeliverable', deliverableId])) {
      fetchObjects(deliverableId, dispatch);
    }
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
  };
};

const createDeliverable = (values) => {
  return (dispatch) => {
    api.postJson('/api/deliverables', { deliverable: values }, (json) => {
      const deliverable = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.CREATE_DELIVERABLE,
        status: constants.STATUS_SUCCESS,
        deliverable,
        entity: deliverable,
      });
    });
  };
};

export {
  visitDeliverable,
  selectDeliverable,
  archiveDeliverable,
  updateDeliverable,
  updateDeliverableRemoteOrigin,
  createDeliverableRemoteOrigin,
  createDeliverable,
};
