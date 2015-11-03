import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM } from '../actions/agendaItems';
import { DELETE_COMMENT } from '../actions/comments';

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function agendaItemsByConversation(state = initialState, action = null) {
  switch (action.type) {
  case SET_AGENDA_ITEMS:
    var conversationId;
    var ids = action.agendaItems.map(function(agendaItem) {
      conversationId = agendaItem.conversationId;
      return agendaItem.id
    });

    return state.set(conversationId, Immutable.List(ids));
  case CREATE_AGENDA_ITEM:
    if(action.status == STATUS_SUCCESS) {
      const convList = state.get(action.agendaItem.conversationId) || Immutable.List();
      return state.set(action.agendaItem.conversationId, convList.push(action.agendaItem.id));
    }
    else {
      return state;
    }
  case DELETE_COMMENT:
    if(action.status == STATUS_SUCCESS) {
      const convId = action.comment.conversationId;
      if(action.comment.attachmentType === 'agenda_items') {
        return state.set(convId, state.get(convId).filter(function(id) {return id != action.comment.attachmentId}));
      }
      else {
        return state;
      }
    }
    else {
      return state;
    }
  default:
    return state;
  }
}
