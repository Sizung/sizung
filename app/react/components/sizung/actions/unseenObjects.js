import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';

export const CREATE_UNSEEN_OBJECT = 'CREATE_UNSEEN_OBJECT';
export const SET_UNSEEN_OBJECTS = 'SET_UNSEEN_OBJECTS';

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
