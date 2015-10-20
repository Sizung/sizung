// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux';
import comments from './comments';
import agendaItems from './agendaItems';
import conversations from './conversations';
import deliverables from './deliverables';

const entities = combineReducers({
  comments,
  agendaItems,
  conversations,
  deliverables
});

const rootReducer = combineReducers({
  entities
});

export default rootReducer;