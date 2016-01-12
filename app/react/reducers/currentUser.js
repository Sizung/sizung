import { SET_CURRENT_USER } from '../actions/users';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function currentUser(state = initialState, action = null) {
  switch (action.type) {
    case SET_CURRENT_USER: return new Immutable.Map({ id: action.currentUser.id, type: action.currentUser.type });
    default: return state;
  }
}
