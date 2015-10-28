import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_USERS, UPDATE_USER } from '../actions/users';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function users(state = initialState, action = null) {
  switch (action.type) {
  case SET_USERS:
    for(var i=0; i<action.users.length; i++) {
      state = state.set(action.users[i].id, action.users[i]);
    }
    return state;
  case UPDATE_USER:
    return state.set(action.user.id, action.user);
  default:
    return state;
  }
}
