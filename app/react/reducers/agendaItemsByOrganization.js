import * as constants from '../actions/organizations';
import * as reducerUtils from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = new Immutable.Map();

export default function agendaItemsByOrganization(state = initialState, action = null) {
  if (action.type === constants.FETCH_ORGANIZATION && (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN)) {
    let newState = state;

    action.agendaItems.forEach((entity) => {
      newState = reducerUtils.setReferenceByObject(newState, entity, action.entity.id);
    });

    return newState;
  }

  return state;
}
