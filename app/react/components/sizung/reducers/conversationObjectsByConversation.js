import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_CONVERSATION_OBJECTS } from '../actions/conversationObjects.js';
import { CREATE_COMMENT, DELETE_COMMENT } from '../actions/comments';
import { CREATE_AGENDA_ITEM } from '../actions/agendaItems'

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function conversationObjectsByConversation(state = initialState, action = null) {
  switch (action.type) {
  case SET_CONVERSATION_OBJECTS:
    var objects = action.conversationObjects.map(function(conversationObject) {
      return { id: conversationObject.id, type: conversationObject.type }
    });

    return state.set(action.conversation.id, Immutable.List(objects));
  case DELETE_COMMENT:
    if(action.status == STATUS_SUCCESS && action.comment.commentableType == 'conversations') {
      const convId = action.comment.commentableId;
      return state.set(convId, state.get(convId).filter(function(identifier) {return identifier.id != action.comment.id}));
    }
    else if(action.status == STATUS_REMOTE_ORIGIN && action.comment.commentableType == 'conversations') {
      const convId = action.comment.commentableId;
      return state.set(convId, state.get(convId).filter(function(identifier) {return identifier.id != action.comment.id}));
    }
    else {
      return state;
    }
  case CREATE_COMMENT:
    if(action.status == STATUS_SUCCESS && action.comment.commentableType == 'conversations') {
      return state.set(action.comment.commentableId, state.get(action.comment.commentableId).unshift({id: action.comment.id, type: action.comment.type}));
    }
    else if(action.status == STATUS_REMOTE_ORIGIN && action.comment.commentableType == 'conversations') {
      return state.set(action.comment.commentableId, state.get(action.comment.commentableId).unshift({id: action.comment.id, type: action.comment.type}));
    }
    else {
      return state;
    }
  case CREATE_AGENDA_ITEM:
    if(action.status == STATUS_SUCCESS) {
      return state.set(action.agendaItem.conversationId, state.get(action.agendaItem.conversationId).unshift({id: action.agendaItem.id, type: action.agendaItem.type}));
    }
    else if(action.status == STATUS_REMOTE_ORIGIN) {
      return state.set(action.agendaItem.conversationId, state.get(action.agendaItem.conversationId).unshift({id: action.agendaItem.id, type: action.agendaItem.type}));
    }
    else {
      return state;
    }
  default:
    return state;
  }
}
