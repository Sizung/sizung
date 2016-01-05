import { expect } from 'chai';
import Immutable from 'immutable';
import { render } from 'enzyme';
import React from 'react';

// import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import AgendaItemList from './index';

describe('AgendaItemList', () => {
  it('lists one single agenda item', () => {
    const noOp = () => {};
    const props = {
      agendaItems: new Immutable.List([{
        id: '123',
        title: 'Discuss the AgendaItemList spec.',
        status: 'open',
        commentsCount: 0,
        deliverablesCount: 0,
        conversationId: '234',
        conversation: { title: 'The main conversation' },
      }]),
      selectAgendaItem: noOp,
      updateAgendaItem: noOp,
    };

    const result = render(<AgendaItemList {...props} />);
    expect(result.text()).to.be.eq('AGENDADiscuss the AgendaItemList spec. 00');
    // expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });
});

