import Immutable from 'immutable';
import * as constants from '../actions/constants';
import * as reducerUtils from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function deliverablesByAgendaItem(state = initialState, action = null) {
  if (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        const type = entity.type;
        if (type === 'deliverables') {
          newState = reducerUtils.updateReferenceByObject(newState, entity, entity.agendaItemId);
        }
      });
    }

    if (action.entity && action.entity.type === 'deliverables') {
      newState = reducerUtils.updateReferenceByObject(newState, action.entity, action.entity.agendaItemId);
    }

    return newState;
  }

  return state;
}
