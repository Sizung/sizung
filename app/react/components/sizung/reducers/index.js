// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux-immutablejs';
import comments from './comments';
import agendaItems from './agendaItems';
import currentUser from './currentUser';
import currentConversation from './currentConversation';
import conversations from './conversations';
import deliverables from './deliverables';
import users from './users';
import agendaItemsByConversation from './agendaItemsByConversation';
import conversationObjectsByConversation from './conversationObjectsByConversation'

const entities = combineReducers({
  conversations,
  comments,
  agendaItems,
  deliverables,
  users
});

const rootReducer = combineReducers({
  currentUser,
  currentConversation,
  conversationObjectsByConversation,
  agendaItemsByConversation,
  entities
});

export default rootReducer;