// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import { routeActions } from 'redux-simple-router';
import * as constants from './constants';
import * as transform from '../utils/jsonApiUtils';
import * as api from '../utils/api';

const updateAgendaItemRemoteOrigin = (agendaItem) => {
  return {
    type: constants.UPDATE_AGENDA_ITEM,
    status: constants.STATUS_REMOTE_ORIGIN,
    agendaItem,
    entity: agendaItem,
  };
};

const updateAgendaItem = (id, changedFields) => {
  return (dispatch) => {
    api.putJson('/api/agenda_items/' + id, { agenda_item: changedFields }, (json) => {
      const agendaItem = transform.transformObjectFromJsonApi(json.data);
      if (changedFields.archived) {
        dispatch(routeActions.push('/conversations/' + agendaItem.conversationId));
      }
      dispatch({
        type: constants.UPDATE_AGENDA_ITEM,
        status: constants.STATUS_SUCCESS,
        agendaItem,
        entity: agendaItem,
      });
    });
  };
};

const archiveAgendaItem = (id) => {
  return updateAgendaItem(id, { archived: true });
};

const deleteAgendaItems = (agendaItems) => {
  return {
    type: constants.DELETE_ALL_AGENDA_ITEMS,
    status: constants.STATUS_SUCCESS,
    agendaItems,
  };
};

const fetchAgendaItem = (agendaItemId, dispatch) => {
  api.fetchJson('/api/agenda_items/' + agendaItemId, (json) => {
    const included = json.included ? json.included.map(transform.transformObjectFromJsonApi) : null;
    const agendaItem = transform.transformObjectFromJsonApi(json.data);
    dispatch({
      type: constants.FETCH_AGENDA_ITEM,
      verb: 'FETCH',
      status: constants.STATUS_SUCCESS,
      agendaItem,
      included,
      entity: agendaItem,
      entities: included,
    });
  });
};

const fetchObjects = (agendaItemId, dispatch) => {
  api.fetchJson('/api/agenda_items/' + agendaItemId + '/conversation_objects', (json) => {
    const parentReference = { type: 'agendaItems', id: agendaItemId };
    const conversationObjects = json.data.map(transform.transformObjectFromJsonApi);

    dispatch({
      type: constants.FETCH_CONVERSATION_OBJECTS,
      status: constants.STATUS_SUCCESS,
      parentReference,
      conversationObjects,
      links: json.links,
      entities: conversationObjects,
    });
  });
};

const visitAgendaItem = (agendaItemId) => {
  return (dispatch) => {
    dispatch(routeActions.push('/agenda_items/' + agendaItemId));
  };
};

const selectAgendaItem = (agendaItemId) => {
  return (dispatch) => {
    fetchAgendaItem(agendaItemId, dispatch);
    fetchObjects(agendaItemId, dispatch);
  };
};

const createAgendaItemRemoteOrigin = (agendaItem) => {
  return {
    type: constants.CREATE_AGENDA_ITEM,
    status: constants.STATUS_REMOTE_ORIGIN,
    agendaItem,
    entity: agendaItem,
  };
};

const createAgendaItem = (values) => {
  return (dispatch) => {
    api.postJson('/api/agenda_items', { agenda_item: values }, (json) => {
      const agendaItem = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.CREATE_AGENDA_ITEM,
        status: constants.STATUS_SUCCESS,
        agendaItem,
        entity: agendaItem,
      });
      dispatch(routeActions.push('/agenda_items/' + agendaItem.id));
    });
  };
};

export {
  createAgendaItem,
  createAgendaItemRemoteOrigin,
  updateAgendaItem,
  updateAgendaItemRemoteOrigin,
  selectAgendaItem,
  visitAgendaItem,
  archiveAgendaItem,
  deleteAgendaItems,
};
