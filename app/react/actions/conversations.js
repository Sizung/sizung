import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';

import { STATUS_IN_PROGRESS, STATUS_SUCCESS } from './statuses.js';
export const SET_CURRENT_CONVERSATION = 'SET_CONVERSATION';

const setCurrentConversation = (conversation, included) => {
  return {
    type: SET_CURRENT_CONVERSATION,
    status: STATUS_SUCCESS,
    conversation,
    entity: conversation,
    entities: included,
  };
};

const fetchConversation = (conversationId) => {
  return (dispatch) => {
    api.fetchJson('/conversations/' + conversationId, (json) => {
      dispatch(setCurrentConversation(transform.transformConversationFromJsonApi(json.data), json.included.map(transform.transformObjectFromJsonApi)));
    });
  };
};

export {
  fetchConversation,
}