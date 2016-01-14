import { fillConversationObject, fillAgendaItem } from './entityUtils';
import Immutable from 'immutable';

const organization = (state, organizationId) => {
  return state.getIn(['entities', 'organizations', organizationId]);
};

const agendaItemsForOrganization = (state, organizationId) => {
  return state.getIn(['entities', 'agendaItems']).toList();
};

const deliverablesForOrganization = (state, organizationId) => {
  return state.getIn(['entities', 'deliverables']).map(deliverable => fillConversationObject(state, deliverable)).toList();
};

const conversationsForOrganization = (state, organizationId) => {
  return state.getIn(['entities', 'conversations']).toList();
};

const currentUser = (state) => state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
const currentConversation = (state) => state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
const currentOrganization = (state) => {
  const currentOrgId = state.getIn(['currentOrganization', 'id']);
  if (!currentOrgId) {
    return null;
  }
  return state.getIn(['entities', 'organizations', currentOrgId]);
};
const organizations = (state) => state.getIn(['entities', 'organizations']).map((organization) => { return organization; }).toList();
const conversationMembers = (state) => state.getIn(['entities', 'conversationMembers']);

const conversationMembersAsUsers = (state, conversationId) => {
  const references = state.getIn(['conversationMembersByConversation', conversationId, 'references']);
  if (!references) {
    return null;
  }

  return references.map((reference) => {
    const conversationMember = state.getIn(['entities', 'conversationMembers', reference.id]);
    return state.getIn(['entities', 'users', conversationMember.memberId]);
  });
};

const conversationObjects = (state, objectsToShow) => {
  if (!objectsToShow) {
    return null;
  }

  return objectsToShow.get('references').map((objectReference) => {
    return fillConversationObject(state, objectReference);
  }).toList().sortBy((conversationObject) => {
    return conversationObject.createdAt;
  }).toJS();
};

const agendaItemsList = (state, conversationId) => {
  const agendaItemIdsToShow = state.getIn(['agendaItemsByConversation', conversationId]);

  if (!agendaItemIdsToShow) {
    return new Immutable.List();
  }

  const agendaItemIds = agendaItemIdsToShow.get('references');

  return agendaItemIds.map((ref) => {
    return state.getIn(['entities', 'agendaItems', ref.id]);
  }).toList().map((agendaItem) => {
    return fillAgendaItem(state, agendaItem.id);
  }).filter((agendaItem) => {
    return !agendaItem.archived;
  }).sortBy((conversationObject) => {
    return conversationObject.createdAt;
  });
};

export {
  currentUser,
  currentConversation,
  currentOrganization,
  organizations,
  conversationMembers,
  conversationObjects,
  agendaItemsList,
  conversationMembersAsUsers,
  agendaItemsForOrganization,
  deliverablesForOrganization,
  conversationsForOrganization,
  organization,
};
