import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import { STATUS_SUCCESS } from './statuses.js';
import { setCurrentOrganization } from './organizations';

export const CONVERSATION = 'CONVERSATION';
export const FETCH_CONVERSATION_OBJECTS = 'FETCH_CONVERSATION_OBJECTS';

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

const fetchConversationObjectsSuccess = (parentReference, conversationObjects, links) => {
  return {
    type: FETCH_CONVERSATION_OBJECTS,
    status: STATUS_SUCCESS,
    parentReference,
    conversationObjects,
    links,
    entities: conversationObjects,
  };
}

const fetchObjects = (conversationId, dispatch) => {
  return api.fetchJson('/conversations/' + conversationId + '/conversation_objects', (json) => {
    dispatch(
      fetchConversationObjectsSuccess(
        { type: 'conversations', id: conversationId },
        json.data.map(transform.transformObjectFromJsonApi),
        json.links
      )
    );
  });
};

const selectConversation = (conversationId) => {
  return (dispatch) => {
    fetchConversation(conversationId, dispatch);
    fetchObjects(conversationId, dispatch);
  };
};

export {
  fetchConversation,
  selectConversation,
}