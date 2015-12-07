import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../actions/statuses.js';
import { FETCH_ORGANIZATIONS, SET_CURRENT_ORGANIZATION } from '../actions/organizations';
import Immutable from 'immutable';
const initialState = Immutable.Map();

export default function organizations(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_ORGANIZATIONS:
      if (action.status == STATUS_SUCCESS) {
        action.organizations.forEach(organization => {
          state = state.set(organization.id, organization);
        });
        return state;
      }
      else {
        return state;
      }
    case SET_CURRENT_ORGANIZATION:
      return state.set(action.organization.id, action.organization);
    default:
      return state;
  }
}
