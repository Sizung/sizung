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
  default:
    return state;
  }
}
