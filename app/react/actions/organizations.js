import { STATUS_SUCCESS } from './statuses.js';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';

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

const fetchOrganizationSuccess = (organization, included) => {
  return {
    type: FETCH_ORGANIZATION,
    status: STATUS_SUCCESS,
    entity: organization,
    entities: included,
  };
};

const fetchOrganization = (organizationId, dispatch) => {
  api.fetchJson('/organizations/' + organizationId, (json) => {
    const organization = transform.transformObjectFromJsonApi(json.data);
    const included = json.included.map(transform.transformObjectFromJsonApi);

    dispatch(fetchOrganizationSuccess(organization, included));
    dispatch(setCurrentOrganization({ id: organizationId, type: 'organizations' }));
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
