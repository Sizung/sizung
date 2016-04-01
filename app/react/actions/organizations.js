import * as constants from './constants';
import * as api from '../utils/api';
import * as transform from '../utils/jsonApiUtils';
import { setUnseenObjects } from './unseenObjects';

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
  });

  api.fetchJson('/api/organizations/' + organizationId + '/unseen_objects', (json) => {
    dispatch(setUnseenObjects(json.data.map(transform.transformUnseenObjectFromJsonApi)));
  });
};

const selectOrganization = (organizationId) => {
  return (dispatch) => {
    fetchOrganization(organizationId, dispatch);
  };
};

export {
  setCurrentOrganization,
  fetchOrganizationsSuccess,
  selectOrganization,
};
