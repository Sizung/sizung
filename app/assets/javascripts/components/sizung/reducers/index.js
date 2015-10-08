// Here the reducer functions are combined and bound to the state-subtree they handle.

import { combineReducers } from 'redux';
import comments from './comments';

const rootReducer = combineReducers({
  comments
});

export default rootReducer;