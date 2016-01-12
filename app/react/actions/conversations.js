import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import { STATUS_SUCCESS } from './statuses.js';
import { setCurrentOrganization } from './organizations';

export const CONVERSATION = 'CONVERSATION';

const setCurrentConversation = (conversation, included, json) => {
  const conversationMembers = json.data.relationships.conversation_members.data;
  const agendaItems = json.data.relationships.agenda_items.data;
  const deliverables = json.data.relationships.deliverables.data;

  return {
    type: CONVERSATION,
    status: STATUS_SUCCESS,
    conversation,
    entity: conversation,
    entities: included,
    conversationMembers,
    agendaItems,
    deliverables,
  };
};

const fetchConversation = (conversationId) => {
  return (dispatch) => {
    api.fetchJson('/conversations/' + conversationId, (json) => {
      const conversation = transform.transformConversationFromJsonApi(json.data);
      dispatch(setCurrentConversation(conversation, json.included.map(transform.transformObjectFromJsonApi), json));
      dispatch(setCurrentOrganization({ id: conversation.organizationId, type: 'organizations' }));
    });
  };
};

export {
  fetchConversation,
}