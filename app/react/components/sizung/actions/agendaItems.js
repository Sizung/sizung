// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import { updatePath } from 'redux-simple-router';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';
import { transformAgendaItemFromJsonApi, transformCommentFromJsonApi, transformConversationObjectFromJsonApi } from '../utils/jsonApiUtils.js';

export const SET_AGENDA_ITEMS = 'SET_AGENDA_ITEMS';
export const CREATE_AGENDA_ITEM = 'CREATE_AGENDA_ITEM';
export const SELECT_AGENDA_ITEM = 'SELECT_AGENDA_ITEM';
export const FETCH_CONVERSATION_OBJECTS = 'FETCH_CONVERSATION_OBJECTS';

export function backToConversation(conversationId) {
  return function(dispatch) {
    dispatch(closeAgendaItem());
    dispatch(updatePath('/conversations/' + conversationId))
  };
}

export function closeAgendaItem() {
  return {
    type: SELECT_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItemId: null
  }
}

function selectAgendaItemSuccess(agendaItemId) {
  return {
    type: SELECT_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItemId: agendaItemId
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

//export function selectAgendaItem(conversationId, agendaItemId) {
//  return function(dispatch) {
//    dispatch(selectAgendaItemWithFetch(agendaItemId));
//    dispatch(updatePath('/conversations/' + conversationId + '/agenda_items/' + agendaItemId));
//  };
//}

function shouldFetch(getState, agendaItemId) {
  if (getState().getIn(['conversationObjectsByAgendaItem', agendaItemId])) {
    return false;
  }
  else {
    return true;
  }
}

function fetchObjects(conversationId, agendaItemId, dispatch) {
  return fetch('/agenda_items/' + agendaItemId + '/conversation_objects', {
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
        { type: 'agendaItems', id: agendaItemId },
        json.data.map(transformConversationObjectFromJsonApi),
        json.links
      )
    );
    dispatch(selectAgendaItemSuccess(agendaItemId));
    dispatch(updatePath('/conversations/' + conversationId + '/agenda_items/' + agendaItemId));
  });
}

export function selectAgendaItem(conversationId, agendaItemId) {
  return function(dispatch, getState) {
    if (shouldFetch(getState, agendaItemId)) {
      return fetchObjects(conversationId, agendaItemId, dispatch);
    }
    else {
      dispatch(selectAgendaItemSuccess(agendaItemId));
      dispatch(updatePath('/conversations/' + conversationId + '/agenda_items/' + agendaItemId));
    }
  };
}

export function setAgendaItems(agendaItems) {
  return {
    type: SET_AGENDA_ITEMS,
    agendaItems: agendaItems.data.map(transformAgendaItemFromJsonApi)
  };
}

export function createAgendaItemSuccess(agendaItem) {
  return {
    type: CREATE_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItem: agendaItem,
  };
}

export function createAgendaItemRemoteOrigin(agendaItem) {
  return {
    type: CREATE_AGENDA_ITEM,
    status: STATUS_REMOTE_ORIGIN,
    agendaItem: agendaItem,
  };
}

export function createAgendaItem(agendaItem) {
  return function(dispatch) {
    return fetch('/agenda_items', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      },
      body: JSON.stringify({
        agenda_item: agendaItem
      })
    })
    .then(response => response.json())
    .then(function(json) {
      dispatch(createAgendaItemSuccess(transformAgendaItemFromJsonApi(json.data)));
    });
  };
}
