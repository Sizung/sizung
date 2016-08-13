import Immutable from 'immutable';
import * as constants from '../actions/constants';
import * as reducerUtils from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function agendaItemsByOrganization(state = initialState, action = null) {
  if (action.type === constants.DELETEALL_AGENDA_ITEMS) {
    let newState = state;
    action.agendaItems.forEach((agendaItem) => {
      newState = reducerUtils.updateReferenceByObject(newState, agendaItem, agendaItem.id);
    });
    return newState;
  } else if (action.type === constants.FETCH_ORGANIZATION && (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN)) {
    let newState = state;

    action.agendaItems.forEach((entity) => {
      newState = reducerUtils.setReferenceByObject(newState, entity, action.entity.id);
    });

    return newState;
  }

  return state;
}
