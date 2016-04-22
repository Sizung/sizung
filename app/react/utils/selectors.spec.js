import { expect } from 'chai';
import Immutable from 'immutable';
import * as utils from './paginationUtils';
import * as selectors from './selectors';

// import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

describe('Selectors', () => {
  it('hides archived deliverables on overview', () => {
    const organizationId = '1';
    const deliverable = { type: 'deliverables', id: 'd1', archived: false, status: 'open' };
    const archivedDeliverable = { type: 'deliverables', id: 'd2', archived: true, status: 'open' };
    
    const state = new Immutable.Map({
      'entities': new Immutable.Map({
        'deliverables': new Immutable.Map({
          'd1': deliverable, 
          'd2': archivedDeliverable,
        }),
        'unseenObjects': new Immutable.Map({}),
      }),
      'deliverablesByOrganization': new Immutable.Map({
        '1': new Immutable.Map({
          'references': new Immutable.List([
            {id: 'd1', type: 'deliverables'},
            {id: 'd2', type: 'deliverables'},
          ])
        })
      })
    });
    
    const deliverableList = selectors.deliverablesForOrganization(state, organizationId);

    expect(deliverableList.size).to.be.eq(1);
  });
});

