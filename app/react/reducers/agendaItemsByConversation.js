import Immutable from 'immutable';
import * as constants from '../actions/constants';
import * as reducerUtils from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function agendaItemsByConversation(state = initialState, action = null) {
  if (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        const type = entity.type;
        if (type === 'agendaItems') {
          newState = reducerUtils.setReferenceByObject(newState, entity, entity.conversationId);
        }
      });
    }

    if (action.entity && action.entity.type === 'agendaItems') {
      newState = reducerUtils.setReferenceByObject(newState, action.entity, action.entity.conversationId);
    }

    return newState;
  }

  return state;
}
