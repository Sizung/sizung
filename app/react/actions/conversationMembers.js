import { STATUS_SUCCESS } from './statuses.js';
import { transformConversationMemberFromJsonApi } from '../utils/jsonApiUtils.js';
import * as api from '../utils/api';

export const CREATE_CONVERSATION_MEMBER = 'CREATE_CONVERSATION_MEMBER';
export const DELETE_CONVERSATION_MEMBER = 'DELETE_CONVERSATION_MEMBER';

const createConversationMemberSuccess = (conversationMember) => {
  return {
    type: CREATE_CONVERSATION_MEMBER,
    status: STATUS_SUCCESS,
    conversationMember,
    entity: conversationMember,
  };
};

const deleteConversationMemberSuccess = (conversationMember) => {
  return {
    type: DELETE_CONVERSATION_MEMBER,
    verb: 'DELETE',
    status: STATUS_SUCCESS,
    conversationMember,
    entity: conversationMember,
  };
};

const createConversationMember = (conversationId, userId) => {
  return (dispatch) => {
    api.postJson('/conversation_members',
      {
        conversation_member: { conversation_id: conversationId, member_id: userId },
      },
      (json) => {
        dispatch(createConversationMemberSuccess(transformConversationMemberFromJsonApi(json.data)));
      });
  };
};

const deleteConversationMember = (memberId) => {
  return (dispatch) => {
    api.deleteJson('/conversation_members/' + memberId, (json) => {
      dispatch(deleteConversationMemberSuccess(transformConversationMemberFromJsonApi(json.data)));
    });
  };
};

export {
  createConversationMember,
  deleteConversationMember,
}