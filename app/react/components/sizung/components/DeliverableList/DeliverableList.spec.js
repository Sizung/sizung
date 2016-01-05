import { expect } from 'chai';
import Immutable from 'immutable';
import { shallow, mount, render } from 'enzyme';
import hook from 'css-modules-require-hook';
import React from 'react';

//import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import DeliverableList from './index';

describe ('DeliverableList', () => {
  it('lists one single deliverable', () => {
    const noOp = () => {}
    const props = {
      deliverables: new Immutable.List([{
        id: '123',
        title: 'Write the DeliverableList spec.',
        status: 'open',
        commentsCount: 0,
        assignee: { firstName: 'Guenter', lastName: 'Glueck', email: 'gugl@guenterglueck.com', presenceStatus: 'offline'},
        agendaItem: {}
      }]),
      selectDeliverable: noOp,
      updateDeliverable: noOp
    };

    const result = render(<DeliverableList {...props} />);

    expect(result.text()).to.be.eq('DELIVERABLESWrite the DeliverableList spec. GG0');
    //expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });
});

