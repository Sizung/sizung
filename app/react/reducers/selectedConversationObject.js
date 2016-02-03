import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SELECT_DELIVERABLE } from '../actions/deliverables';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function agendaItems(state = initialState, action = null) {
  switch (action.type) {
    case SELECT_DELIVERABLE: return state.set('type', 'deliverables').set('id', action.deliverableId);
    default: return state;
  }
}