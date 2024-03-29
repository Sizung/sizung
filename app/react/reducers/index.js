// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux-immutablejs';
import currentUser from './currentUser';
import currentConversation from './currentConversation';
import currentOrganization from './currentOrganization';
import agendaItemsByConversation from './agendaItemsByConversation';
import conversationObjectsByConversation from './conversationObjectsByConversation';
import conversationObjectsByAgendaItem from './conversationObjectsByAgendaItem';
import conversationObjectsByDeliverable from './conversationObjectsByDeliverable';
import conversationMembersByConversation from './conversationMembersByConversation';
import conversationsByOrganization from './conversationsByOrganization';
import agendaItemsByOrganization from './agendaItemsByOrganization';
import deliverablesByOrganization from './deliverablesByOrganization';
import deliverablesByAgendaItem from './deliverablesByAgendaItem';
import deliverablesByConversation from './deliverablesByConversation';
import conversationUi from './conversationUi';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import entitiesReducer from './entitiesReducer';
import navigationHistory from './navigationHistoryReducer';

const rootReducer = combineReducers({
  routing: routeReducer,
  entities: entitiesReducer,
  currentUser,
  currentConversation,
  currentOrganization,
  conversationObjectsByConversation,
  conversationObjectsByAgendaItem,
  conversationObjectsByDeliverable,
  agendaItemsByConversation,
  conversationsByOrganization,
  agendaItemsByOrganization,
  deliverablesByOrganization,
  deliverablesByAgendaItem,
  deliverablesByConversation,
  conversationMembersByConversation,
  conversationUi,
  navigationHistory,
});

export default rootReducer;
