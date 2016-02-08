import * as transform from '../utils/jsonApiUtils.js';
import * as api from '../utils/api';
import * as constants from './constants';

const createConversationMember = (conversationId, userId) => {
  return (dispatch) => {
    api.postJson('/api/conversation_members',
      {
        conversation_member: { conversation_id: conversationId, member_id: userId },
      },
      (json) => {
        const conversationMember = transform.transformObjectFromJsonApi(json.data);

        dispatch({
          type: constants.CREATE_CONVERSATION_MEMBER,
          status: constants.STATUS_SUCCESS,
          conversationMember,
          entity: conversationMember,
        });
      });
  };
};

const deleteConversationMember = (memberId) => {
  return (dispatch) => {
    api.deleteJson('/api/conversation_members/' + memberId, (json) => {
      const conversationMember = transform.transformObjectFromJsonApi(json.data);

      dispatch({
        type: constants.DELETE_CONVERSATION_MEMBER,
        verb: constants.DELETE,
        status: constants.STATUS_SUCCESS,
        conversationMember,
        entity: conversationMember,
      });
    });
  };
};

export {
  createConversationMember,
  deleteConversationMember,
};
