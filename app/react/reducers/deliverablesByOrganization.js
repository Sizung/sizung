import { STATUS_SUCCESS, STATUS_REMOTE_ORIGIN } from '../actions/statuses';
import * as constants from '../actions/organizations';
import * as reducerUtils from '../utils/reducerUtils';
import Immutable from 'immutable';

const initialState = new Immutable.Map();

export default function deliverablesByOrganization(state = initialState, action = null) {
  if (action.type === constants.FETCH_ORGANIZATION && (action.status === STATUS_SUCCESS || action.status === STATUS_REMOTE_ORIGIN)) {
    let newState = state;

    action.deliverables.forEach((entity) => {
      newState = reducerUtils.setReferenceByObject(newState, entity, action.entity.id);
    });

    return newState;
  }

  return state;
}
