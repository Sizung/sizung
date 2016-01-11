import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from '../actions/statuses';
import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM } from '../actions/agendaItems';
import * as reducerUtils from '../utils/reducerUtils';

import Immutable from 'immutable';

const initialState = new Immutable.Map();

// function ref(list, refType) {
//   list.forEach((entity) => {
//     if (entity.type === refType) {
//       addRef(entity.get(parentIdField), toRef(entity));
//     }
//   });
// }

export default function agendaItemsByConversation(state = initialState, action = null) {
  if (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN) {
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
