import { expect } from 'chai';
import Immutable from 'immutable';
import * as utils from './paginationUtils';
import * as selectors from './selectors';

// import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

describe('Selectors', () => {
  it('hides archived deliverables on overview', () => {
    const organizationId = '1';
    const deliverable = {type: 'deliverables', id: 'd1', archived: false, status: 'open'};
    const archivedDeliverable = {type: 'deliverables', id: 'd2', archived: true, status: 'open'};

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

  it('Gets the agenda item title number', () => {
    const title = 'hm 11 Hello world';
    expect(parseInt(title.split(/(\d+)/)[1], 10)).to.be.eq(11);
  });

  it('Numbered AgendaItems are sorted by their numbers', () => {
    const conversationId = '1';
    const a1 = {
      type: 'agendaItems',
      id: 'a1',
      archived: false,
      status: 'open',
      title: 'Open',
      createdAt: '2015-12-1T11:18:29.121Z',
    };
    const a2 = {
      type: 'agendaItems',
      id: 'a2',
      archived: false,
      status: 'open',
      title: '1 first',
      createdAt: '2015-12-2T13:18:29.121Z',
    };
    const a3 = {
      type: 'agendaItems',
      id: 'a3',
      archived: false,
      status: 'open',
      title: '4 fourth',
      createdAt: '2015-12-3T12:18:29.121Z',
    };
    const a4 = {
      type: 'agendaItems',
      id: 'a4',
      archived: false,
      status: 'open',
      title: '2 real second',
      createdAt: '2015-12-3T14:18:29.121Z',
    };

    const state = new Immutable.Map({
      entities: new Immutable.Map({
        agendaItems: new Immutable.Map({
          a1,
          a2,
          a3,
          a4,
        }),
        unseenObjects: new Immutable.Map({}),
      }),
      agendaItemsByConversation: new Immutable.Map({
        1: new Immutable.Map({
          references: new Immutable.List([
            { id: 'a1', type: 'agendaItems' },
            { id: 'a2', type: 'agendaItems' },
            { id: 'a3', type: 'agendaItems' },
            { id: 'a4', type: 'agendaItems' },
          ]),
        }),
      }),
    });

    const agendaItemList = selectors.agendaItemsList(state, conversationId);
    expect(agendaItemList.size).to.be.eq(4);
    expect(agendaItemList.get(0).id).to.equal('a2');
    expect(agendaItemList.get(1).id).to.equal('a4');
    expect(agendaItemList.get(2).id).to.equal('a3');
    expect(agendaItemList.get(3).id).to.equal('a1');
  });

  it('Orders agendaItemlist with numbered agendas at top and sorted in ascending order', () => {
    const conversationId = '1';
    const agendaItemStartingWithoutNumber = {
      type: 'agendaItems',
      id: 'a1',
      archived: false,
      status: 'open',
      title: 'Open',
      createdAt: '2015-12-1T16:18:29.121Z',
    };
    const agendaItemStartingWithNumber1AndResolved = {
      type: 'agendaItems',
      id: 'a2',
      archived: false,
      status: 'resolved',
      title: '1 Open',
      createdAt: '2015-12-2T16:18:29.121Z',
    };
    const agendaItemStartingWithNumber4 = {
      type: 'agendaItems',
      id: 'a3',
      archived: false,
      status: 'open',
      title: '4 Open',
      createdAt: '2015-12-3T16:18:29.121Z',
    };
    const agendaItemStartingWithNumber22 = {
      type: 'agendaItems',
      id: 'a4',
      archived: false,
      status: 'open',
      title: '22  Open',
      createdAt: '2015-12-4T16:18:29.121Z',
    };
    const agendaItemStartingWithoutNumberAndResolved = {
      type: 'agendaItems',
      id: 'a5',
      archived: false,
      status: 'resolved',
      title: 'Resolved',
      createdAt: '2015-11-5T16:18:29.121Z',
    };
    const agendaItemArchived = {
      type: 'agendaItems',
      id: 'a6',
      archived: true,
      status: 'open',
      title: 'Archived',
      createdAt: '2015-12-6T16:18:29.121Z',
    };
    const agendaItemStartingWithNumber14 = {
      type: 'agendaItems',
      id: 'a7',
      archived: false,
      status: 'open',
      title: '14       Open',
      createdAt: '2015-12-10T16:18:29.121Z',
    };
    const agendaItemStartingWithNumberAndNoSpace = {
      type: 'agendaItems',
      id: 'a8',
      archived: false,
      status: 'open',
      title: '144Open',
      createdAt: '2015-12-10T16:18:29.121Z',
    };


    const state = new Immutable.Map({
      'entities': new Immutable.Map({
        'agendaItems': new Immutable.Map({
          'a1': agendaItemStartingWithoutNumber,
          'a2': agendaItemStartingWithNumber1AndResolved,
          'a3': agendaItemStartingWithNumber4,
          'a4': agendaItemStartingWithNumber22,
          'a5': agendaItemStartingWithoutNumberAndResolved,
          'a6': agendaItemArchived,
          'a7': agendaItemStartingWithNumber14,
          'a8': agendaItemStartingWithNumberAndNoSpace,
        }),
        'unseenObjects': new Immutable.Map({}),
      }),
      'agendaItemsByConversation': new Immutable.Map({
        '1': new Immutable.Map({
          'references': new Immutable.List([
            { id: 'a1', type: 'agendaItems' },
            { id: 'a2', type: 'agendaItems' },
            { id: 'a3', type: 'agendaItems' },
            { id: 'a4', type: 'agendaItems' },
            { id: 'a5', type: 'agendaItems' },
            { id: 'a6', type: 'agendaItems' },
            { id: 'a7', type: 'agendaItems' },
            { id: 'a8', type: 'agendaItems' },
          ]),
        }),
      }),
    });

    const agendaItemList = selectors.agendaItemsList(state, conversationId);
    expect(agendaItemList.size).to.be.eq(7);
    expect(agendaItemList.get(0).id).to.equal('a3');
    expect(agendaItemList.get(1).id).to.equal('a7');
    expect(agendaItemList.get(2).id).to.equal('a4');
    expect(agendaItemList.get(3).id).to.equal('a8');
    expect(agendaItemList.get(4).id).to.equal('a1');
    expect(agendaItemList.get(5).id).to.equal('a5');
    expect(agendaItemList.get(6).id).to.equal('a2');
  });

});
