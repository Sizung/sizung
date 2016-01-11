import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import Immutable from 'immutable';
const initialState = new Immutable.Map({
  deliverables: new Immutable.Map(),
  unseenObjects: new Immutable.Map(),
});

const entitiesReducer = (state = initialState, action = null) => {
  if (action.verb === 'DELETE' && (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN)) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        const type = entity.type;
        newState = newState.deleteIn([type, entity.id]);
      });
    }

    if (action.entity) {
      newState = newState.deleteIn([action.entity.type, action.entity.id]);
    }

    return newState;
  } else if (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        const type = entity.type;
        newState = newState.setIn([type, entity.id], entity);
      });
    }

    if (action.entity) {
      newState = newState.setIn([action.entity.type, action.entity.id], action.entity);
    }

    return newState;
  }

  return state;
};

export default entitiesReducer;
