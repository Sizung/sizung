import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_USERS = 'SET_USERS';
export const UPDATE_USER = 'UPDATE_USER';
import { transformUserFromJsonApi } from '../utils/jsonApiUtils.js';

export function setCurrentUser(currentUser) {
  return {
    type: SET_CURRENT_USER,
    currentUser: transformUserFromJsonApi(currentUser)
  };
}

export function setUsers(users) {
  return {
    type: SET_USERS,
    users: users.map(transformUserFromJsonApi)
  };
}

export function updateUserRemoteOrigin(user) {
  return {
    type: UPDATE_USER,
    status: STATUS_REMOTE_ORIGIN,
    user: transformUserFromJsonApi(user)
  }
}