// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';

export const SET_AGENDA_ITEMS = 'SET_AGENDA_ITEMS';
export const CREATE_AGENDA_ITEM = 'CREATE_AGENDA_ITEM';

function transformFromJsonApi(agendaItem) {
  return {
    id: agendaItem.id,
    title: agendaItem.attributes.title,
    ownerId: agendaItem.relationships.owner.data.id,
    conversationId: agendaItem.relationships.conversation.data.id
  };
}


export function setAgendaItems(agendaItems) {
  return {
    type: SET_AGENDA_ITEMS,
    agendaItems: agendaItems.data.map(transformFromJsonApi)
  };
}

export function createAgendaItemSuccess(agendaItem) {
  return {
    type: CREATE_AGENDA_ITEM,
    status: STATUS_SUCCESS,
    agendaItem: agendaItem
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
      dispatch(createAgendaItemSuccess(transformFromJsonApi(json.data)));
    });
  };
}
