import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = Immutable.Map();

export default function currentUser(state = initialState, action = null) {
  switch (action.type) {
    case constants.SET_CURRENT_USER: return new Immutable.Map({ id: action.currentUser.id, type: action.currentUser.type });
    default: return state;
  }
}
