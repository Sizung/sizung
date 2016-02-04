import Immutable from 'immutable';
import * as constants from '../actions/constants';

const initialState = Immutable.Map();

export default function currentOrganization(state = initialState, action = null) {
  switch (action.type) {
    case constants.SET_CURRENT_ORGANIZATION: return new Immutable.Map(action.organization);
    default: return state;
  }
}
