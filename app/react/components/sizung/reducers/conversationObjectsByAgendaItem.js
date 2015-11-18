import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/conversationObjects.js'
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { CREATE_DELIVERABLE } from '../actions/deliverables';
import { add, remove, fetchInProgress, fetched, toReference } from '../utils/paginationUtils';

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByAgendaItem(state = initialState, action = null) {
  switch (action.type) {
  case FETCH_CONVERSATION_OBJECTS:
    if(action.parentReference.type === 'agendaItems') {
      if (action.status == STATUS_SUCCESS) {
        const objects = action.conversationObjects.map(toReference);
        return fetched(state, action.parentReference.id, objects, action);
      } else {
        return fetchInProgress(state, action.parentReference.id);
      }
    }
    else {
      return state;
    }
  case CREATE_COMMENT:
    if((action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) && action.comment.commentableType == 'agendaItems') {
      return add(state, action.comment.commentableId, toReference(action.comment));
    }
    else {
      return state;
    }
  case DELETE_COMMENT:
    if((action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) && action.comment.commentableType == 'agendaItems') {
      return remove(state, action.comment.commentableId, toReference(action.comment));
    }
    else {
      return state;
    }
  case CREATE_DELIVERABLE:
    if(action.status == STATUS_SUCCESS || action.status == STATUS_REMOTE_ORIGIN) {
      return add(state, action.deliverable.agendaItemId, toReference(action.deliverable));
    }
    else {
      return state;
    }
  default:
    return state;
  }
}
