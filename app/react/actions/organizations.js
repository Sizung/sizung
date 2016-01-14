import { STATUS_SUCCESS } from './statuses.js';

export const FETCH_ORGANIZATIONS = 'FETCH_ORGANIZATIONS';
export const SET_CURRENT_ORGANIZATION = 'SET_CURRENT_ORGANIZATION';

const setCurrentOrganization = (organization) => {
  return {
    type: SET_CURRENT_ORGANIZATION,
    status: STATUS_SUCCESS,
    organization,
    entity: organization,
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

export {
  setCurrentOrganization,
  fetchOrganizationsSuccess,
};
