// These are the actions relevant to agenda items
// They are being injected into components as callbacks they can call when they want to propagate an event.
// The action function itself then only has the responsibility to transform the
// incoming parameter to describe the event.
// The type is the only mandatory field in the structure and describes the type of the action.
// By this type, the reducer function then decides how to handle the action.

import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';

import { transformDeliverableFromJsonApi } from '../utils/jsonApiUtils';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses';

export const SET_DELIVERABLES = 'SET_DELIVERABLES';
export const CREATE_DELIVERABLE = 'CREATE_DELIVERABLE';

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

export function createDeliverable(deliverable) {
  return function(dispatch) {
    return fetch('/deliverables', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      },
      body: JSON.stringify({
        deliverable: deliverable
      })
    })
    .then(response => response.json())
    .then(function(json) {
      dispatch(createDeliverableSuccess(transformDeliverableFromJsonApi(json.data)));
    });
  };
}


