import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from './statuses.js';
export const SET_CONVERSATION_MEMBERS = 'SET_CONVERSATION_MEMBERS';
export const CREATE_CONVERSATION_MEMBER = 'CREATE_CONVERSATION_MEMBER';
import { transformConversationMemberFromJsonApi } from '../utils/jsonApiUtils.js';

export function setConversationMembers(conversationId, conversationMembers) {
  return {
    type: SET_CONVERSATION_MEMBERS,
    status: STATUS_SUCCESS,
    conversationId,
    conversationMembers
  };
}

export function createConversationMemberSuccess(conversationMember) {
  return {
    type: CREATE_CONVERSATION_MEMBER,
    status: STATUS_SUCCESS,
    conversationMember
  }
}

export function createConversationMember(conversationId, userId) {
  return function(dispatch) {
    return fetch('/conversation_members', {
      method: 'post',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken()
      },
      body: JSON.stringify({
        conversation_member: {conversation_id: conversationId, member_id: userId}
      })
    })
    .then(response => response.json())
    .then(function(json) {
      dispatch(createConversationMemberSuccess(transformConversationMemberFromJsonApi(json.data)));
    });
  };
}
