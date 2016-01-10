import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM } from '../actions/agendaItems';
import { setReference } from '../utils/reducerUtils';

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
  switch (action.type) {
    case SET_AGENDA_ITEMS:
      let conversationId = null;
      const ids = action.agendaItems.map((agendaItem) => {
        conversationId = agendaItem.conversationId;
        return agendaItem.id;
      });

      return state.set(conversationId, new Immutable.List(ids));
    case CREATE_AGENDA_ITEM: return setReference(state, action, 'agendaItem', 'conversationId');
    default: return state;
  }
}
