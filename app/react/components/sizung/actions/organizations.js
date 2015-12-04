import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';
import { transformOrganizationFromJsonApi } from '../utils/jsonApiUtils';

export const FETCH_ORGANIZATIONS = 'FETCH_ORGANIZATIONS';

function fetchOrganizationsSuccess(organizations) {
  return {
    type: FETCH_ORGANIZATIONS,
    status: STATUS_SUCCESS,
    organizations: organizations
  };
}

export function fetchOrganizations() {
  return function(dispatch) {
    return fetch('/organizations', {
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
        fetchOrganizationsSuccess(
          json.data.map(transformOrganizationFromJsonApi)
        )
      );
    });
  };
}