import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function entityReducerForType(type) {
  return function entityReducer(state = initialState, action = null) {
    if (action.entities && action.verb === 'DELETE' && (action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN)) {
      action.entities.forEach((entity) => {
        if(entity.type === type) {
          state = state.delete(entity.id);
        }
      });
      return state;
    }
    else if (action.entity && action.verb === 'DELETE' && (action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN)) {
      if(action.entity.type === type) {
        state = state.delete(action.entity.id);
      }
      return state;
    }
    else if (action.entity && action.entity.type === type && (action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN)) {
      return state.set(action.entity.id, action.entity);
    }
    else if (action.entities && (action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN)) {
      action.entities.forEach((entity) => {
        if(entity.type === type) {
          state = state.set(entity.id, entity);
        }
      });
      return state;
    }
    else {
      return state;
    }
  }
}

//export default function entityReducer(state = initialState, action = null) {
//  if (action.entity && (action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN)) {
//    return state.set(entity.id, entity);
//  }
//  else {
//    return state;
//  }
//}
