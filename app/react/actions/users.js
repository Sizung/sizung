import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from './statuses.js';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_USERS = 'SET_USERS';
export const UPDATE_USER = 'UPDATE_USER';
import { transformUserFromJsonApi } from '../utils/jsonApiUtils.js';

export function setCurrentUser(currentUser) {
  return {
    type: SET_CURRENT_USER,
    status: STATUS_SUCCESS,
    currentUser: transformUserFromJsonApi(currentUser),
    entity: transformUserFromJsonApi(currentUser),
  };
}

export function setUsers(users) {
  return {
    type: SET_USERS,
    status: STATUS_SUCCESS,
    users: users.map(transformUserFromJsonApi),
    entities: users.map(transformUserFromJsonApi),
  };
}

export function updateUserRemoteOrigin(user) {
  return {
    type: UPDATE_USER,
    status: STATUS_REMOTE_ORIGIN,
    user: transformUserFromJsonApi(user),
    entity: transformUserFromJsonApi(user),
  };
}