import { routeActions } from 'redux-simple-router';
import * as constants from './constants';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import * as ConversationUiActions from './conversationUi.js';

const setCurrentOrganization = (organization) => {
  return {
    type: constants.SET_CURRENT_ORGANIZATION,
    status: constants.STATUS_SUCCESS,
    organization,
  };
};

const fetchOrganizationsSuccess = (organizations) => {
  return {
    type: constants.FETCH_ORGANIZATIONS,
    status: constants.STATUS_SUCCESS,
    organizations,
    entities: organizations,
  };
};

const fetchOrganizationSuccess = (organization, included, conversations, agendaItems, deliverables, conversationDeliverables) => {
  return {
    type: constants.FETCH_ORGANIZATION,
    status: constants.STATUS_SUCCESS,
    entity: organization,
    entities: included,
    conversations,
    agendaItems,
    deliverables,
    conversationDeliverables,
  };
};

const fetchOrganizationOnlySuccess = (organization, included) => {
  return {
    type: constants.FETCH_ORGANIZATION_ONLY,
    status: constants.STATUS_SUCCESS,
    entity: organization,
    entities: included,
  };
};

const fetchOrganization = (organizationId, dispatch) => {
  api.fetchJson('/api/organizations/' + organizationId, (json) => {
    const organization = transform.transformObjectFromJsonApi(json.data, json.meta);
    const conversations = json.meta.conversations.data.map(transform.transformObjectFromJsonApi);
    const agendaItems = json.meta.agenda_items.data.map(transform.transformObjectFromJsonApi);
    const deliverables = json.meta.deliverables.data.map(transform.transformObjectFromJsonApi);
    const conversationDeliverables = json.meta.conversation_deliverables.data.map(transform.transformObjectFromJsonApi);
    const included = json.included.map(transform.transformObjectFromJsonApi).concat(conversations).concat(agendaItems).concat(deliverables).concat(conversationDeliverables);

    dispatch(fetchOrganizationSuccess(organization, included, conversations, agendaItems, deliverables, conversationDeliverables));
    dispatch(setCurrentOrganization({ id: organizationId, type: 'organizations' }));
    dispatch(ConversationUiActions.resetConversationUi());
  });
};

const fetchOrganizationOnly = (organizationId, dispatch) => {
  api.fetchJson('/api/organizations/shallow/' + organizationId, (json) => {
    const organization = transform.transformObjectFromJsonApi(json.data, json.meta);
    const included = json.included.map(transform.transformObjectFromJsonApi);
    dispatch(fetchOrganizationOnlySuccess(organization, included));
    dispatch(setCurrentOrganization({ id: organizationId, type: 'organizations' }));
    dispatch(ConversationUiActions.resetConversationUi());
  });
};

const selectOrganization = (organizationId) => {
  return (dispatch) => {
    fetchOrganization(organizationId, dispatch);
  };
};

// Following action is for fetching just organization and its members and not its conv/actions/agendas
const selectOrganizationOnly = (organizationId) => {
  return (dispatch) => {
    fetchOrganizationOnly(organizationId, dispatch);
  };
};

const updateOrganization = (id, changedFields) => {
  return (dispatch) => {
    api.putJson('/api/organizations/' + id, { organization: changedFields }, (json) => {
      const organization = transform.transformObjectFromJsonApi(json.data);
      dispatch({
        type: constants.UPDATE_ORGANIZATION,
        status: constants.STATUS_SUCCESS,
        organization,
        entity: organization,
      });
    });
  };
};

const visitOrganization = (organizationId) => {
  return (dispatch) => {
    dispatch(routeActions.push('/organizations/' + organizationId));
  };
};

export {
  setCurrentOrganization,
  fetchOrganizationsSuccess,
  selectOrganization,
  selectOrganizationOnly,
  updateOrganization,
  visitOrganization,
};
