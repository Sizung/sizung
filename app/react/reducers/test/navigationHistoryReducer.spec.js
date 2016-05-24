import reducer from '../navigationHistoryReducer';
import { expect } from 'chai';
import Immutable from 'immutable';

import * as constants from '../../actions/constants';

describe('navigationHistoryReducer', () => {
  it('pushes the current Url to Navigation History', () => {
    let payload = { pathname: '/organizations/123' };
    let nextState = reducer(undefined, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload,
    });

    expect(nextState).to.have.sizeOf(1);

    payload = { pathname: '/conversations/456' };
    nextState = reducer(nextState, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload,
    });

    expect(nextState).to.have.sizeOf(2);

    payload = { pathname: '/agenda_items/789' };
    nextState = reducer(nextState, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload,
    });

    expect(nextState).to.have.sizeOf(3);

    payload = { pathname: '/deliverables/123' };
    nextState = reducer(nextState, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload,
    });

    expect(nextState).to.have.sizeOf(4);

    expect(nextState.get(0)).to.eq('/organizations/123');
    expect(nextState.get(1)).to.eq('/conversations/456');
    expect(nextState.get(2)).to.eq('/agenda_items/789');
    expect(nextState.get(3)).to.eq('/deliverables/123');

  });

  it('checks if Navigation History removes old url from history if history size exceeds 100', () => {
    let payload = { pathname: '/samplepath/0' };
    let nextState = reducer(undefined, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload,
    });

    for (var i=0 ; i<99 ; i++) {
      nextState = reducer(nextState, {
        type: constants.ROUTE_LOCATION_UPDATE,
        payload: { pathname: '/samplepath/' + (i+1) },
      });
    }
    expect(nextState).to.have.sizeOf(100);
    expect(nextState.indexOf('/samplepath/0')).to.eq(0);

    nextState = reducer(nextState, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload: { pathname: '/samplepath/101' },
    });
    expect(nextState).to.have.sizeOf(100);

    nextState = reducer(nextState, {
      type: constants.ROUTE_LOCATION_UPDATE,
      payload: { pathname: '/samplepath/102' },
    });
    expect(nextState).to.have.sizeOf(100);

    expect(nextState.indexOf('/samplepath/0')).to.eq(-1);
    expect(nextState.indexOf('/samplepath/1')).to.eq(-1);
    expect(nextState.indexOf('/samplepath/102')).to.eq(99);
    expect(nextState.indexOf('/samplepath/101')).to.eq(98);
  });
});
