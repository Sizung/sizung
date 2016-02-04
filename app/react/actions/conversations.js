import { routeActions } from 'redux-simple-router';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import * as constants from './constants';
import { setCurrentOrganization } from './organizations';
import { setUnseenObjects } from './unseenObjects';

const setCurrentConversation = (conversation, included, json) => {
  const conversationMembers = json.data.relationships.conversation_members.data;
  const agendaItems = json.data.relationships.agenda_items.data;
  const deliverables = json.data.relationships.deliverables.data;

  return {
    type: constants.CONVERSATION,
    status: constants.STATUS_SUCCESS,
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
    api.fetchJson('/api/conversations/' + conversationId + '/unseen_objects', (json) => {
      dispatch(setUnseenObjects(json.data.map(transform.transformUnseenObjectFromJsonApi)));
    });

    api.fetchJson('/api/conversations/' + conversationId, (json) => {
      const conversation = transform.transformConversationFromJsonApi(json.data);
      dispatch(setCurrentConversation(conversation, json.included.map(transform.transformObjectFromJsonApi), json));
      dispatch(setCurrentOrganization({ id: conversation.organizationId, type: 'organizations' }));
    });
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

const selectConversation = (conversationId) => {
  return (dispatch) => {
    api.fetchJson('/api/conversations/' + conversationId + '/unseen_objects', (json) => {
      dispatch(setUnseenObjects(json.data.map(transform.transformUnseenObjectFromJsonApi)));
    });

    api.fetchJson('/api/conversations/' + conversationId, (json) => {
      const conversation = transform.transformConversationFromJsonApi(json.data);
      dispatch(setCurrentConversation(conversation, json.included.map(transform.transformObjectFromJsonApi), json));
      dispatch(setCurrentOrganization({ id: conversation.organizationId, type: 'organizations' }));
    });
    fetchObjects(conversationId, dispatch);
  };
};

const visitConversation = (conversationId) => {
  return (dispatch) => {
    dispatch(routeActions.push('/conversations/' + conversationId));
  };
};

export {
  fetchConversation,
  selectConversation,
  visitConversation,
};
