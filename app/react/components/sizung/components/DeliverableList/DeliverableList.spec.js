import { expect } from 'chai';
import Immutable from 'immutable';
import { shallow } from 'enzyme';
import hook from 'css-modules-require-hook';
import React from 'react';

//import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import DeliverableList from './index';

describe ('DeliverableList', () => {
  it('lists one single deliverable', () => {
    const noop = () => {}
    const props = {
      deliverables: new Immutable.List([{
        id: '123',
        title: 'Write the DeliverableLiec.',
        status: 'open',
        agendaItem: {}
      }]),
      selectDeliverable: noop,
      updateDeliverable: noop
    };

    const result = shallow(<DeliverableList {...props} />);

    expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });
});

