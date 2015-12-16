import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { SET_CONVERSATION_MEMBERS, CREATE_CONVERSATION_MEMBER, DELETE_CONVERSATION_MEMBER } from '../actions/conversationMembers';
import { setObjects, deleteObject } from '../utils/reducerUtils';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function conversationMembers(state = initialState, action = null) {
  switch (action.type) {
    case SET_CONVERSATION_MEMBERS: return setObjects(state, action, 'conversationMembers');
    case CREATE_CONVERSATION_MEMBER: return setObject(state, action, 'conversationMember');
    case DELETE_CONVERSATION_MEMBER: return deleteObject(state, action, 'conversationMember');
    default: return state;
  }
}
