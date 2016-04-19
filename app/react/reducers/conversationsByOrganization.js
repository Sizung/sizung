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
  } else if (action.type === constants.CREATE_CONVERSATION && action.status === constants.STATUS_SUCCESS) {
    return reducerUtils.setReference(state, action, 'conversation', 'organizationId');
  } else if (action.type === constants.DELETE_CONVERSATION && action.status === constants.STATUS_SUCCESS) {
    return reducerUtils.removeReference(state, action, 'conversation', 'organizationId');
  }
  return state;
}
