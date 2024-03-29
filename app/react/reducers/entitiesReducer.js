import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = new Immutable.Map({
  organizations: new Immutable.Map(),
  conversations: new Immutable.Map(),
  agendaItems: new Immutable.Map(),
  deliverables: new Immutable.Map(),
  unseenObjects: new Immutable.Map(),
  attachments: new Immutable.Map(),
});

const isEntity = (candidate) => {
  return Object.keys(candidate).length > 2;
};

const entitiesReducer = (state = initialState, action = null) => {
  if (action.verb === constants.DELETE && (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN)) {
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
  } else if (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        if (isEntity(entity)) {
          const type = entity.type;
          newState = newState.setIn([type, entity.id], entity);
        }
      });
    }

    if (action.entity) {
      if (isEntity(action.entity)) {
        newState = newState.setIn([action.entity.type, action.entity.id], action.entity);
      }
    }

    return newState;
  }

  return state;
};

export default entitiesReducer;
