// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux';
import comments from './comments';
import agendaItems from './agendaItems';
import currentConversation from './currentConversation';
import deliverables from './deliverables';
import commentsByConversation from './commentsByConversation';

const entities = combineReducers({
  comments,
  agendaItems,
  deliverables
});

const rootReducer = combineReducers({
  currentConversation,
  commentsByConversation,
  entities
});

export default rootReducer;