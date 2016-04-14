import Immutable from 'immutable';
import * as constants from '../actions/constants';
import * as reducerUtils from '../utils/reducerUtils';

const initialState = new Immutable.Map();

export default function deliverablesByConversation(state = initialState, action = null) {
  if (action.status === constants.STATUS_SUCCESS || action.status === constants.STATUS_REMOTE_ORIGIN) {
    let newState = state;

    if (action.entities) {
      action.entities.forEach((entity) => {
        const type = entity.type;
        if (type === 'deliverables' && entity.parentType === 'conversations') {
          newState = reducerUtils.updateReferenceByObject(newState, entity, entity.parentId);
        }
      });
    }

    if (action.entity && action.entity.type === 'deliverables' && action.entity.parentType === 'conversations') {
      newState = reducerUtils.updateReferenceByObject(newState, action.entity, action.entity.parentId);
    }

    return newState;
  }

  return state;
}
