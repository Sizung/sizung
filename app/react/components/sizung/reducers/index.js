// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux-immutablejs';
import comments from './comments';
import agendaItems from './agendaItems';
import currentUser from './currentUser';
import currentConversation from './currentConversation';
import currentOrganization from './currentOrganization';
import organizations from './organizations';
import conversations from './conversations';
import deliverables from './deliverables';
import users from './users';
import agendaItemsByConversation from './agendaItemsByConversation';
import conversationObjectsByConversation from './conversationObjectsByConversation';
import selectedConversationObject from './selectedConversationObject';
import conversationObjectsByAgendaItem from './conversationObjectsByAgendaItem';
import conversationObjectsByDeliverable from './conversationObjectsByDeliverable';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';

const entities = combineReducers({
  organizations,
  conversations,
  comments,
  agendaItems,
  deliverables,
  users
});

const rootReducer = combineReducers({
  routing: routeReducer,
  selectedConversationObject,
  currentUser,
  currentConversation,
  currentOrganization,
  conversationObjectsByConversation,
  conversationObjectsByAgendaItem,
  conversationObjectsByDeliverable,
  agendaItemsByConversation,
  entities
});

export default rootReducer;