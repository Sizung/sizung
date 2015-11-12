import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { FETCH_CONVERSATION_OBJECTS } from '../actions/agendaItems'
import { CREATE_COMMENT } from '../actions/comments';
import { CREATE_DELIVERABLE } from '../actions/deliverables';

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByAgendaItem(state = initialState, action = null) {
  switch (action.type) {
  case FETCH_CONVERSATION_OBJECTS:
    if(action.parentReference.type === 'agendaItems') {
      var objects = action.conversationObjects.map(function(conversationObject) {
        return { id: conversationObject.id, type: conversationObject.type }
      });

      return state.set(action.parentReference.id, Immutable.List(objects));
    }
    else {
      return state;
    }
  case CREATE_COMMENT:
    if(action.status == STATUS_SUCCESS && action.comment.commentableType == 'agendaItems') {
      return state.set(action.comment.commentableId, state.get(action.comment.commentableId).unshift({id: action.comment.id, type: action.comment.type}));
    }
    else if(action.status == STATUS_REMOTE_ORIGIN && action.comment.commentableType == 'agendaItems') {
      const list = state.get(action.comment.commentableId) || Immutable.List();
      return state.set(action.comment.commentableId, list.unshift({id: action.comment.id, type: action.comment.type}));
    }
    else {
      return state;
    }
  case CREATE_DELIVERABLE:
    console.log('create deliverable: ', action);
    if(action.status == STATUS_SUCCESS) {
      console.log('in success', state.get(action.deliverable.agendaItemId).unshift({id: action.deliverable.id, type: action.deliverable.type}).toJS());
      return state.set(action.deliverable.agendaItemId, state.get(action.deliverable.agendaItemId).unshift({id: action.deliverable.id, type: action.deliverable.type}));
    }
    else if(action.status == STATUS_REMOTE_ORIGIN) {
      const list = state.get(action.deliverable.agendaItemId) || Immutable.List();
      return state.set(action.deliverable.agendaItemId, list.unshift({id: action.deliverable.id, type: action.deliverable.type}));
    }
    else {
      return state;
    }
  default:
    return state;
  }
}
