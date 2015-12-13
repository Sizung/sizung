import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_USERS, UPDATE_USER } from '../actions/users';
import { setObject, deleteObject, setObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function users(state = initialState, action = null) {
  switch (action.type) {
  case SET_USERS: return setObjects(state, action, 'users');
  case UPDATE_USER: return setObject(state, action, 'user');
  default:
    return state;
  }
}
