// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux';
import comments from './comments';
import agendaItems from './agendaItems';

const rootReducer = combineReducers({
  comments,
  agendaItems
});

export default rootReducer;