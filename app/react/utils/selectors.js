import { fillConversationObject, fillAgendaItem } from './entityUtils';
import Immutable from 'immutable';

const currentUser = (state) => state.getIn(['entities', 'users', state.getIn(['currentUser', 'id'])]);
const currentConversation = (state) => state.getIn(['entities', 'conversations', state.getIn(['currentConversation', 'id'])]);
const currentOrganization = (state) => state.getIn(['entities', 'organizations', state.getIn(['currentOrganization', 'id'])]);
const organizations = (state) => state.getIn(['entities', 'organizations']).map((organization) => { return organization; }).toList();
const conversationMembers = (state) => state.getIn(['entities', 'conversationMembers']);

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
  console.log('agendaItemsList: ', conversationId);
  const agendaItemIdsToShow = state.getIn(['agendaItemsByConversation', conversationId]);
  console.log('agendaItemsList: ', agendaItemIdsToShow);

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
};
