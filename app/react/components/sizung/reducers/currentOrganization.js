import { SET_CURRENT_ORGANIZATION } from '../actions/organizations';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function currentOrganization(state = initialState, action = null) {
  switch (action.type) {
  case SET_CURRENT_ORGANIZATION:
    return Immutable.fromJS(action.organization);
  default:
    return state;
  }
}
