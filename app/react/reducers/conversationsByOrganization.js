import Immutable from 'immutable';
import * as constants from '../actions/constants';
import * as reducerUtils from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function conversationsByOrganization(state = initialState, action = null) {
  if (action.type === constants.FETCH_ORGANIZATION && (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN)) {
    let newState = reducerUtils.initReferences(state, action.entity.id);

    action.conversations.forEach((entity) => {
      newState = reducerUtils.setReferenceByObject(newState, entity, action.entity.id);
    });

    return newState;
  }

  return state;
}
