import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from '../actions/statuses';
import * as reducerUtils from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = new Immutable.Map();

export default function deliverablesByAgendaItem(state = initialState, action = null) {
  if (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        const type = entity.type;
        if (type === 'deliverables') {
          newState = reducerUtils.setReferenceByObject(newState, entity, entity.agendaItemId);
        }
      });
    }

    if (action.entity && action.entity.type === 'deliverables') {
      newState = reducerUtils.setReferenceByObject(newState, action.entity, action.entity.agendaItemId);
    }

    return newState;
  }

  return state;
}
