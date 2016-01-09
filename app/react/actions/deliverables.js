// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';

import { transformConversationObjectFromJsonApi, transformDeliverableFromJsonApi } from '../utils/jsonApiUtils';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses';
import { updatePath } from 'redux-simple-router';

export const SET_DELIVERABLES = 'SET_DELIVERABLES';
export const CREATE_DELIVERABLE = 'CREATE_DELIVERABLE';
export const UPDATE_DELIVERABLE = 'UPDATE_DELIVERABLE';
export const SELECT_DELIVERABLE = 'SELECT_DELIVERABLE';
export const FETCH_CONVERSATION_OBJECTS = 'FETCH_CONVERSATION_OBJECTS';

export function archiveDeliverable(id) {
  return updateDeliverable(id, { archived: true });
}

export function updateDeliverableRemoteOrigin(deliverable) {
  return {
    type: UPDATE_DELIVERABLE,
    status: STATUS_REMOTE_ORIGIN,
    deliverable: deliverable
  };
}

export function updateDeliverableSuccess(deliverable) {
  return {
    type: UPDATE_DELIVERABLE,
    status: STATUS_SUCCESS,
    deliverable: deliverable
  };
}

export function updateDeliverable(id, changedFields) {
  return function(dispatch) {
    return fetch('/deliverables/' + id, {
      method: 'PUT',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      },
      body: JSON.stringify({
        deliverable: changedFields
      })
    })
    .then(response => response.json())
    .then(function(json) {
      dispatch(updateDeliverableSuccess(transformDeliverableFromJsonApi(json.data)));
    });
  };
}

export function backToConversation(conversationId) {
  return function(dispatch) {
    dispatch(updatePath('/conversations/' + conversationId))
  };
}

function selectDeliverableSuccess(agendaItemId, deliverableId) {
  return {
    type: SELECT_DELIVERABLE,
    status: STATUS_SUCCESS,
    deliverableId: deliverableId
  }
}

function fetchConversationObjectsSuccess(parentReference, conversationObjects, links) {
  return {
    type: FETCH_CONVERSATION_OBJECTS,
    status: STATUS_SUCCESS,
    parentReference: parentReference,
    conversationObjects: conversationObjects,
    links: links
  };
}

function shouldFetch(getState, deliverableId) {
  if (getState().getIn(['conversationObjectsByDeliverable', deliverableId])) {
    return false;
  }
  else {
    return true;
  }
}

function fetchObjects(conversationId, agendaItemId, deliverableId, dispatch) {
  return fetch('/deliverables/' + deliverableId + '/conversation_objects', {
    method: 'get',
    credentials: 'include', // send cookies with it
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': MetaTagsManager.getCSRFToken()
    }
  })
  .then(response => response.json())
  .then(function(json) {
    dispatch(
      fetchConversationObjectsSuccess(
        { type: 'deliverables', id: deliverableId },
        json.data.map(transformConversationObjectFromJsonApi),
        json.links
      )
    );
    dispatch(selectDeliverableSuccess(agendaItemId, deliverableId));
    dispatch(updatePath('/conversations/' + conversationId + '/agenda_items/' + agendaItemId + '/deliverables/' + deliverableId));
  });
}

export function selectDeliverable(conversationId, agendaItemId, deliverableId) {
  return function(dispatch, getState) {
    if (shouldFetch(getState, deliverableId)) {
      return fetchObjects(conversationId, agendaItemId, deliverableId, dispatch);
    }
    else {
      dispatch(selectDeliverableSuccess(agendaItemId, deliverableId));
      dispatch(updatePath('/conversations/' + conversationId + '/agenda_items/' + agendaItemId + '/deliverables/' + deliverableId));
    }
  };
}

export function setDeliverables(deliverables = []) {
  return {
    type: SET_DELIVERABLES,
    deliverables: deliverables.data.map(transformDeliverableFromJsonApi)
  };
}

function createDeliverableSuccess(deliverable) {
  return {
    type: CREATE_DELIVERABLE,
    status: STATUS_SUCCESS,
    deliverable: deliverable
  };
}

export function createDeliverableRemoteOrigin(deliverable) {
  return {
    type: CREATE_DELIVERABLE,
    status: STATUS_REMOTE_ORIGIN,
    deliverable: deliverable
  };
}

export function createDeliverable(deliverable) {
  return (dispatch) => {
    return fetch('/deliverables', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      },
      body: JSON.stringify({
        deliverable,
      }),
    })
    .then(response => response.json())
    .then((json) => {
      dispatch(createDeliverableSuccess(transformDeliverableFromJsonApi(json.data)));
    });
  };
}
