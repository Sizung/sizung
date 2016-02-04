// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import { routeActions } from 'redux-simple-router';
import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from './statuses.js';
import { transformObjectFromJsonApi, transformAgendaItemFromJsonApi, transformConversationObjectFromJsonApi } from '../utils/jsonApiUtils.js';
import * as api from '../utils/api';

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
    api.putJson('/api/agenda_items/' + id, { agenda_item: changedFields }, (json) => {
      const agendaItem = transformAgendaItemFromJsonApi(json.data);
      dispatch({
        type: UPDATE_AGENDA_ITEM,
        status: STATUS_SUCCESS,
        agendaItem,
        entity: agendaItem,
      });
    });
  };
}

export function archiveAgendaItem(id) {
  return updateAgendaItem(id, { archived: true });
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
  api.fetchJson('/api/agenda_items/' + agendaItemId, (json) => {
    const included = json.included ? json.included.map(transformObjectFromJsonApi) : null;
    dispatch(fetchAgendaItemSuccess(transformAgendaItemFromJsonApi(json.data), included));
  });
}

function fetchObjects(agendaItemId, dispatch) {
  api.fetchJson('/api/agenda_items/' + agendaItemId + '/conversation_objects', (json) => {
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
    api.postJson('/api/agenda_items', { agenda_item: agendaItem }, (json) => {
      dispatch(createAgendaItemSuccess(transformAgendaItemFromJsonApi(json.data)));
    });
  };
}
