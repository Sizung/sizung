import reducer from '../agendaItems';
import { expect } from 'chai';
import Immutable from 'immutable';

import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM, UPDATE_AGENDA_ITEM } from '../../actions/agendaItems';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../../actions/statuses.js';

describe ('agendaItems', () => {
  it('creates an agenda item', () => {
    const agendaItem = { id: '123', title: 'How to implement the next big thing' };

    const nextState = reducer(undefined, {
      type:       CREATE_AGENDA_ITEM,
      status:     STATUS_SUCCESS,
      agendaItem: agendaItem
    });

    const expectedState = Immutable.Map({
      '123': agendaItem
    });

    expect( nextState ).to.eq(expectedState);
  });
});