import { STATUS_SUCCESS } from './statuses.js';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import { setUnseenObjects } from './unseenObjects';

export const FETCH_ORGANIZATION = 'FETCH_ORGANIZATION';
export const FETCH_ORGANIZATIONS = 'FETCH_ORGANIZATIONS';
export const SET_CURRENT_ORGANIZATION = 'SET_CURRENT_ORGANIZATION';

const setCurrentOrganization = (organization) => {
  return {
    type: SET_CURRENT_ORGANIZATION,
    status: STATUS_SUCCESS,
    organization,
  };
};

const fetchOrganizationsSuccess = (organizations) => {
  return {
    type: FETCH_ORGANIZATIONS,
    status: STATUS_SUCCESS,
    organizations,
    entities: organizations,
  };
};

const fetchOrganizationSuccess = (organization, included, conversations, agendaItems, deliverables) => {
  return {
    type: FETCH_ORGANIZATION,
    status: STATUS_SUCCESS,
    entity: organization,
    entities: included,
    conversations,
    agendaItems,
    deliverables,
  };
};

const fetchOrganization = (organizationId, dispatch) => {
  api.fetchJson('/api/organizations/' + organizationId, (json) => {
    const organization = transform.transformObjectFromJsonApi(json.data, json.meta);
    const conversations = json.meta.conversations.data.map(transform.transformObjectFromJsonApi);
    const agendaItems = json.meta.agenda_items.data.map(transform.transformObjectFromJsonApi);
    const deliverables = json.meta.deliverables.data.map(transform.transformObjectFromJsonApi);
    const included = json.included.map(transform.transformObjectFromJsonApi).concat(conversations).concat(agendaItems).concat(deliverables);

    dispatch(fetchOrganizationSuccess(organization, included, conversations, agendaItems, deliverables));
    dispatch(setCurrentOrganization({ id: organizationId, type: 'organizations' }));
  });

  api.fetchJson('/api/organizations/' + organizationId + '/unseen_objects', (json) => {
    dispatch(setUnseenObjects(json.data.map(transform.transformUnseenObjectFromJsonApi)));
  });
};

const selectOrganization = (organizationId) => {
  return (dispatch) => {
    fetchOrganization(organizationId, dispatch);
  };
};

export {
  setCurrentOrganization,
  fetchOrganizationsSuccess,
  selectOrganization,
};
