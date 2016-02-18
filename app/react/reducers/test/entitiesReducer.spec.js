import reducer from '../entitiesReducer';
import { expect } from 'chai';
import Immutable from 'immutable';

import * as constants from '../../actions/constants';

describe('entitiesReducer', () => {
  it('sets multiple entities by type', () => {
    const agendaItem123 = { id: '123', type: 'agendaItems', title: 'How to implement the next big thing' };
    const agendaItem456 = { id: '456', type: 'agendaItems', title: 'How to implement the next great thing' };

    const nextState = reducer(undefined, {
      type: 'ACTION TYPE DOES NOT MATTER HERE',
      status: constants.STATUS_SUCCESS,
      entities: [agendaItem123, agendaItem456],
    });

    const expectedState = new Immutable.Map({
      '123': agendaItem123,
      '456': agendaItem456,
    });

    expect(nextState.get('agendaItems')).to.eq(expectedState);
  });

  it('sets a single entity by type', () => {
    const agendaItem = { id: '123', type: 'agendaItems', title: 'How to implement the next big thing' };

    const nextState = reducer(undefined, {
      type: 'ACTION TYPE DOES NOT MATTER HERE',
      status: constants.STATUS_SUCCESS,
      entity: agendaItem,
    });

    const expectedState = new Immutable.Map({
      '123': agendaItem,
    });

    expect(nextState.get('agendaItems')).to.eq(expectedState);
  });
});
