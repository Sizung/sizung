import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../utils/MetaTagsManager';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses';
import { transformUnseenObjectFromJsonApi } from '../utils/jsonApiUtils';

export const SET_UNSEEN_OBJECTS = 'SET_UNSEEN_OBJECTS';
export const CREATE_UNSEEN_OBJECT = 'CREATE_UNSEEN_OBJECT';
export const DELETE_UNSEEN_OBJECTS = 'DELETE_UNSEEN_OBJECTS';
export const DELETE = 'DELETE';

export function deleteUnseenObjectsSuccess(unseenObjects) {
  return {
    type: DELETE_UNSEEN_OBJECTS,
    verb: DELETE,
    status: STATUS_SUCCESS,
    entities: unseenObjects
  };
}

export function markAsSeen(seenType, seenId) {
  if(seenType === 'agendaItems') {
    seenType = 'agenda_items';
  }
  return (dispatch, store) => {
    return fetch('/' + seenType + '/' + seenId + '/unseen_objects', {
      method: 'delete',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      }}
    )
    .then(response => response.json())
    .then(function(json) {
        dispatch(deleteUnseenObjectsSuccess(json.data.map(transformUnseenObjectFromJsonApi)));
    });
  }
}

export function setUnseenObjects(unseenObjects) {
  return {
    type: SET_UNSEEN_OBJECTS,
    status: STATUS_REMOTE_ORIGIN,
    entities: unseenObjects
  };
}

export function createUnseenObjectRemoteOrigin(unseenObject) {
  return {
    type: CREATE_UNSEEN_OBJECT,
    status: STATUS_REMOTE_ORIGIN,
    entity: unseenObject
  };
}

export function deleteUnseenObjectRemoteOrigin(unseenObject) {
  return {
    type: DELETE_UNSEEN_OBJECTS,
    verb: DELETE,
    status: STATUS_REMOTE_ORIGIN,
    entity: unseenObject,
  };
}
