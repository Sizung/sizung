import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { FETCH_ORGANIZATIONS, SET_CURRENT_ORGANIZATION } from '../actions/organizations';
import { setObject, deleteObject, setObjects } from '../utils/reducerUtils';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function organizations(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_ORGANIZATIONS: return setObjects(state, action, 'organizations');
    case SET_CURRENT_ORGANIZATION: return setObject(state, action, 'organization');
    default:
      return state;
  }
}
