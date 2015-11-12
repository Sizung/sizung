import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SELECT_AGENDA_ITEM } from '../actions/agendaItems';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function agendaItems(state = initialState, action = null) {
  switch (action.type) {
  case SELECT_AGENDA_ITEM:
    return state.set('type', 'agendaItems').set('id', action.agendaItemId);
  default:
    return state;
  }
}
