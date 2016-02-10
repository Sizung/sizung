import reducer from '../deliverablesByAgendaItem';
import { expect } from 'chai';
import Immutable from 'immutable';
import * as utils from '../../utils/paginationUtils';
import * as constants from '../../actions/constants';

describe('deiverablesByAgendaItem', () => {
  it('sets one deliverable for the agendaItem', () => {
    const deliverable = { id: '1', type: 'deliverables', agendaItemId: '123' };

    const nextState = reducer(undefined, {
      type: 'ACTION TYPE DOES NOT MATTER HERE',
      status: constants.STATUS_SUCCESS,
      entity: deliverable,
    });

    const expectedState = new Immutable.Set([utils.toReference(deliverable)]);

    expect(nextState.getIn(['123', 'references'])).to.eq(expectedState);
  });

  it('moves deliverable from one AgendaItem to another', () => {
    const deliverable = { id: '1', type: 'deliverables', agendaItemId: '123' };
    const initialState = new Immutable.Map({ '123': new Immutable.Map({ 'references': new Immutable.Set([utils.toReference(deliverable)]) }) });
    const movedDeliverable = { id: '1', type: 'deliverables', agendaItemId: '456' };

    const nextState = reducer(initialState, {
      type: 'ACTION TYPE DOES NOT MATTER HERE',
      status: constants.STATUS_SUCCESS,
      entity: movedDeliverable,
    });

    const expectedState = new Immutable.Set([utils.toReference(deliverable)]);

    expect(nextState.getIn(['456', 'references'])).to.eq(expectedState); // Should be added to new parent
    expect(nextState.getIn(['123', 'references'])).to.eq(new Immutable.Set([])); // Should be removed from old parent
  });
});
