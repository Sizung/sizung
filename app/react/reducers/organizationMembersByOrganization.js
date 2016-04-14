import Immutable from 'immutable';
import * as constants from '../actions/constants';
import { setReference, removeReference } from '../utils/reducerUtils';
import { fetched } from '../utils/paginationUtils';

const initialState = new Immutable.Map();

export default function organizationMembersByOrganization(state = initialState, action = null) {
  switch (action.type) {
    case constants.INVITE_ORGANIZATION_MEMBER: return setReference(state, action, 'organizationMember', 'organizationId');
    case constants.DELETE_ORGANIZATION_MEMBER: return removeReference(state, action, 'organizationMember', 'organizationId');
    default: return state;
  }
}
