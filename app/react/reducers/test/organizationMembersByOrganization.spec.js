import reducer from '../organizationMembersByOrganization';
import { expect } from 'chai';
import Immutable from 'immutable';

import * as constants from '../../actions/constants';

describe('organizationMembersByOrganization', () => {
  it('on create organization member', () => {
    const organizationMember = { id: '123', type: 'organizationMembers', organizationId: '1', memberId: '11' };

    const nextState = reducer(undefined, {
      type: constants.CREATE_ORGANIZATION_MEMBER,
      status: constants.STATUS_REMOTE_ORIGIN,
      organizationMember,
    });

    const expectedState = new Immutable.Map({
      '1': { type: 'organizationMembers', id: '123'},
    });

    expect(nextState.getIn(['1', 'references']).toJS()[0].id).to.eq('123');
  });
});
