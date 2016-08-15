import Immutable from 'immutable';
import * as constants from '../actions/constants';
import * as reducerUtils from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function deliverablesByOrganization(state = initialState, action = null) {
  if (action.type === constants.DELETE_ALL_DELIVERABLES) {
    let newState = state;
    action.deliverables.forEach((deliverables) => {
      newState = reducerUtils.updateReferenceByObject(newState, deliverables, deliverables.id);
    });
    return newState;
  } else if (action.type === constants.FETCH_ORGANIZATION && (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN)) {
    let newState = state;

    action.deliverables.forEach((entity) => {
      newState = reducerUtils.setReferenceByObject(newState, entity, action.entity.id);
    });

    action.conversationDeliverables.forEach((entity) => {
      newState = reducerUtils.setReferenceByObject(newState, entity, action.entity.id);
    });

    //if (action.entities) {
    //  action.entities.forEach((entity) => {
    //    const type = entity.type;
    //    if (type === 'deliverables') {
    //      newState = reducerUtils.updateReferenceByObject(newState, entity, action.entity.id);
    //    }
    //  });
    //}
    //
    //if (action.entity && action.entity.type === 'deliverables') {
    //  newState = reducerUtils.updateReferenceByObject(newState, action.entity, action.entity.id);
    //}

    return newState;
  }

  return state;
}
