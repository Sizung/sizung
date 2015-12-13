import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';

export function setObject(state, action, objectName) {
  if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
    return state.set(action[objectName].id, action[objectName]);
  }
  else {
    return state;
  }
}

export function deleteObject(state, action, objectName) {
  if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
    return state.remove(action['objectName'].id);
  }
  else {
    return state;
  }
}

export function setObjects(state, action, objectListName) {
  for(var i=0; i<action[objectListName].length; i++) {
    state = state.set(action[objectListName][i].id, action[objectListName][i]);
  }
  return state;
}