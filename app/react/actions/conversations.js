import { routeActions } from 'redux-simple-router';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import * as constants from './constants';
import { setCurrentOrganization } from './organizations';
import * as ConversationUiActions from './conversationUi';
import { deleteAgendaItems } from './agendaItems.js';
import { deleteDeliverables } from './deliverables.js';
import * as timetracks from "./timetracks";

const setCurrentConversation = (conversation, included, json) => {
  const conversationMembers = json.data.relationships.conversation_members.data;
  const agendaItems = json.data.relationships.agenda_items.data;
  const deliverables = json.data.relationships.deliverables.data;
  const agendaItemDeliverables = json.data.relationships.agenda_item_deliverables.data;

  return {
    type: constants.CONVERSATION,
    status: constants.STATUS_SUCCESS,
    conversation,
    entity: conversation,
    entities: included,
    conversationMembers,
    agendaItems,
    deliverables,
    agendaItemDeliverables,
  };
};

const updateConversation = (id, changedFields) => {
  return (dispatch) => {
    api.putJson('/api/conversations/' + id, { conversation: changedFields }, (json) => {
      const conversation = transform.transformObjectFromJsonApi(json.data);
      const conversationMembers = json.data.relationships.conversation_members.data;
      const entities = json.included ? json.included.map(transform.transformObjectFromJsonApi) : [];
      dispatch({
        type: constants.UPDATE_CONVERSATION,
        status: constants.STATUS_SUCCESS,
        conversation,
        entity: conversation,
        entities,
        conversationMembers,
      });
      if (changedFields.archived) {
        dispatch(routeActions.push('/organizations/' + conversation.organizationId));
      }
    });
  };
};

const updateConversationRemoteOrigin = (conversation, entities) => {
  const conversationMembers = conversation.conversation_members;
  return {
    type: constants.UPDATE_CONVERSATION,
    status: constants.STATUS_REMOTE_ORIGIN,
    conversation,
    entity: conversation,
    entities,
    conversationMembers,
  };
};

const fetchConversationObjectsSuccess = (parentReference, conversationObjects, links) => {
  return {
    type: constants.FETCH_CONVERSATION_OBJECTS,
    status: constants.STATUS_SUCCESS,
    parentReference,
    conversationObjects,
    links,
    entities: conversationObjects,
  };
};

const fetchObjects = (conversationId, dispatch) => {
  return api.fetchJson('/api/conversations/' + conversationId + '/conversation_objects', (json) => {
    dispatch(
      fetchConversationObjectsSuccess(
        { type: 'conversations', id: conversationId },
        json.data.map(transform.transformObjectFromJsonApi),
        json.links
      )
    );
  });
};

const fetchConversation = (conversationId) => {
  return (dispatch) => {
    api.fetchJson('/api/conversations/' + conversationId, (json) => {
      const conversation = transform.transformConversationFromJsonApi(json.data);
      dispatch(setCurrentConversation(conversation, json.included.map(transform.transformObjectFromJsonApi), json));
      dispatch(setCurrentOrganization({ id: conversation.organizationId, type: 'organizations' }));
      dispatch(ConversationUiActions.resetConversationUi());
      fetchObjects(conversationId, dispatch);
    });
  };
};

const visitConversation = (conversationId) => {
  return (dispatch) => {
    dispatch(routeActions.push('/conversations/' + conversationId));
  };
};

const createConversation = (values) => {
  return (dispatch) => {
    api.postJson('/api/conversations', { conversation: values }, (json) => {
      const conversation = transform.transformObjectFromJsonApi(json.data);
      dispatch(routeActions.push('/conversations/' + conversation.id));
      dispatch({
        type: constants.CREATE_CONVERSATION,
        status: constants.STATUS_SUCCESS,
        conversation,
        entity: conversation,
      });
    });
  };
};
// TODO: when conv creation is success and returns data we can avoid fetching data again as conversation opens.

const deleteConversation = (conversationId, organizationId, agendaItems, deliverables) => {
  return (dispatch) => {
    if (confirm('Are you sure you want to archive this Conversation?')) {
      dispatch(updateConversation(conversationId, { archived: true }));
      dispatch(routeActions.push('/organizations/' + organizationId));
      if (agendaItems) {
        dispatch(deleteAgendaItems(agendaItems));
      }
      if (deliverables) {
        dispatch(deleteDeliverables(deliverables));
      }
    }
  };
};

export {
  fetchConversation,
  visitConversation,
  updateConversation,
  updateConversationRemoteOrigin,
  createConversation,
  deleteConversation,
};
