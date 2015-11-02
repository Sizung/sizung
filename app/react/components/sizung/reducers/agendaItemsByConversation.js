import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM } from '../actions/agendaItems';

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function agendaItemsByConversation(state = initialState, action = null) {
  switch (action.type) {
  case SET_AGENDA_ITEMS:
    var conversationId;
    var ids = action.agendaItems.data.map(function(agendaItem) {
      conversationId = agendaItem.relationships.conversation.data.id;
      return agendaItem.id
    });

    return state.set(conversationId, Immutable.List(ids));
  case CREATE_AGENDA_ITEM:
    if(action.status == STATUS_SUCCESS) {
      return state.set(action.agendaItem.data.relationships.conversation.data.id, state.get(action.agendaItem.data.relationships.conversation.data.id).push(action.agendaItem.data));
    }
    else {
      return state;
    }
  default:
    return state;
  }
}
