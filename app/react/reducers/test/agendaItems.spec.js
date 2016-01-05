import reducer from '../agendaItems';
import { expect } from 'chai';
import Immutable from 'immutable';

import { SET_AGENDA_ITEMS, CREATE_AGENDA_ITEM, UPDATE_AGENDA_ITEM } from '../../actions/agendaItems';
import { STATUS_IN_PROGRESS, STATUS_SUCCESS, STATUS_FAILURE, STATUS_REMOTE_ORIGIN } from '../../actions/statuses.js';
import { FETCH_CONVERSATION_OBJECTS } from '../../actions/conversationObjects';

describe ('agendaItems', () => {
  it('set agenda items', () => {
    const agendaItem123 = { id: '123', title: 'How to implement the next big thing' };
    const agendaItem456 = { id: '456', title: 'How to implement the next great thing' };

    const nextState = reducer(undefined, {
      type:       SET_AGENDA_ITEMS,
      status:     STATUS_SUCCESS,
      agendaItems: [agendaItem123, agendaItem456]
    });

    const expectedState = Immutable.Map({
      '123': agendaItem123,
      '456': agendaItem456
    });

    expect( nextState ).to.eq(expectedState);
  });

  it('stores from a fetch of conversation objects', () => {
    const agendaItem123 = { id: '123', type: 'agendaItems', title: 'How to implement the next big thing' };
    const agendaItem456 = { id: '456', type: 'agendaItems', title: 'How to implement the next great thing' };
    const deliverable1  = { id: '1', title: 'some title' };

    const nextState = reducer(undefined, {
      type:                 FETCH_CONVERSATION_OBJECTS,
      status:               STATUS_SUCCESS,
      conversationObjects:  [agendaItem123, deliverable1, agendaItem456]
    });

    const expectedState = Immutable.Map({
      '123': agendaItem123,
      '456': agendaItem456
    });

    expect( nextState ).to.eq(expectedState);

  });

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

  it('updates an agenda item', () => {
    const agendaItem = { id: '123', title: 'How to implement the next big thing' };

    const nextState = reducer(undefined, {
      type:       UPDATE_AGENDA_ITEM,
      status:     STATUS_SUCCESS,
      agendaItem: agendaItem
    });

    const expectedState = Immutable.Map({
      '123': agendaItem
    });

    expect( nextState ).to.eq(expectedState);
  });

});