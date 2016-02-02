// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import { routeActions } from 'redux-simple-router';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from './statuses.js';
import { transformObjectFromJsonApi, transformAgendaItemFromJsonApi, transformConversationObjectFromJsonApi } from '../utils/jsonApiUtils.js';

export const SET_AGENDA_ITEMS = 'SET_AGENDA_ITEMS';
export const CREATE_AGENDA_ITEM = 'CREATE_AGENDA_ITEM';
export const UPDATE_AGENDA_ITEM = 'UPDATE_AGENDA_ITEM';
export const FETCH_AGENDA_ITEM = 'FETCH_AGENDA_ITEM';
export const FETCH_CONVERSATION_OBJECTS = 'FETCH_CONVERSATION_OBJECTS';

export function updateAgendaItemRemoteOrigin(agendaItem) {
  return {
    type: UPDATE_AGENDA_ITEM,
    status: STATUS_REMOTE_ORIGIN,
    agendaItem,
    entity: agendaItem,
  };
}

export function updateAgendaItemSuccess(agendaItem) {
  return {
    type: UPDATE_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItem,
    entity: agendaItem,
  };
}

export function fetchAgendaItemSuccess(agendaItem, included) {
  return {
    type: FETCH_AGENDA_ITEM,
    verb: 'FETCH',
    status: STATUS_SUCCESS,
    agendaItem,
    included,
    entity: agendaItem,
    entities: included,
  };
}

export function updateAgendaItem(id, changedFields) {
  return (dispatch) => {
    return fetch('/api/agenda_items/' + id, {
      method: 'PUT',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
      },
      body: JSON.stringify({
        agenda_item: changedFields,
      }),
    })
    .then(response => response.json())
    .then((json) => {
      dispatch(updateAgendaItemSuccess(transformAgendaItemFromJsonApi(json.data)));
    });
  };
}

export function archiveAgendaItem(id) {
  return updateAgendaItem(id, { archived: true });
}

export function closeAgendaItem() {
  return {
    type: SELECT_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItemId: null,
  };
}

export function backToConversation(conversationId) {
  return (dispatch) => {
    dispatch(closeAgendaItem());
    dispatch(routeActions.push('/conversations/' + conversationId));
  };
}

function fetchConversationObjectsSuccess(parentReference, conversationObjects, links) {
  return {
    type: FETCH_CONVERSATION_OBJECTS,
    status: STATUS_SUCCESS,
    parentReference,
    conversationObjects,
    links,
    entities: conversationObjects,
  };
}

function shouldFetch(getState, agendaItemId) {
  return !getState().getIn(['conversationObjectsByAgendaItem', agendaItemId]);
}

function fetchAgendaItem(agendaItemId, dispatch) {
  return fetch('/api/agenda_items/' + agendaItemId, {
    method: 'get',
    credentials: 'include', // send cookies with it
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
    },
  })
  .then(response => response.json())
  .then((json) => {
    const included = json.included ? json.included.map(transformObjectFromJsonApi) : null;
    dispatch(fetchAgendaItemSuccess(transformAgendaItemFromJsonApi(json.data), included));
  });
}

function fetchObjects(agendaItemId, dispatch) {
  return fetch('/api/agenda_items/' + agendaItemId + '/conversation_objects', {
    method: 'get',
    credentials: 'include', // send cookies with it
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
    },
  })
  .then(response => response.json())
  .then((json) => {
    dispatch(
      fetchConversationObjectsSuccess(
        { type: 'agendaItems', id: agendaItemId },
        json.data.map(transformConversationObjectFromJsonApi),
        json.links
      )
    );
  });
}

export function visitAgendaItem(agendaItemId) {
  return (dispatch) => {
    dispatch(routeActions.push('/agenda_items/' + agendaItemId));
  };
}

export function selectAgendaItem(agendaItemId) {
  return (dispatch) => {
    fetchAgendaItem(agendaItemId, dispatch);
    fetchObjects(agendaItemId, dispatch);
  };
}

export function setAgendaItems(agendaItems) {
  return {
    type: SET_AGENDA_ITEMS,
    agendaItems: agendaItems.data.map(transformAgendaItemFromJsonApi),
    entities: agendaItems.data.map(transformAgendaItemFromJsonApi),
  };
}

export function createAgendaItemSuccess(agendaItem) {
  return {
    type: CREATE_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItem,
    entity: agendaItem,
  };
}

export function createAgendaItemRemoteOrigin(agendaItem) {
  return {
    type: CREATE_AGENDA_ITEM,
    status: STATUS_REMOTE_ORIGIN,
    agendaItem,
    entity: agendaItem,
  };
}

export function createAgendaItem(agendaItem) {
  return (dispatch) => {
    return fetch('/api/agenda_items', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
      },
      body: JSON.stringify({
        agenda_item: agendaItem,
      }),
    })
    .then(response => response.json())
    .then((json) => {
      dispatch(createAgendaItemSuccess(transformAgendaItemFromJsonApi(json.data)));
    });
  };
}
