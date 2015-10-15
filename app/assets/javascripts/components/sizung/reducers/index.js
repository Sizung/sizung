// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux';
import comments from './comments';
import agendaItems from './agendaItems';
import conversations from './conversations';

const rootReducer = combineReducers({
  comments,
  agendaItems,
  conversations
});

export default rootReducer;