import { expect } from 'chai';
import Immutable from 'immutable';
import { shallow, mount, render } from 'enzyme';
import hook from 'css-modules-require-hook';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

//import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import DeliverableList from './index';

describe ('DeliverableList', () => {
  it('lists one single deliverable', () => {
    const noOp = () => {};
    const props = {
      deliverables: new Immutable.List([{
        id: '123',
        title: 'Write the DeliverableList spec.',
        status: 'open',
        commentsCount: 0,
        assignee: { firstName: 'Guenter', lastName: 'Glueck', email: 'gugl@guenterglueck.com', presenceStatus: 'offline' },
        parent: { id: '1', type: 'agendaItems' },
      }]),
      visitDeliverable: noOp,
      updateDeliverable: noOp,
    };

    const reducer = (currentState, action) => {
      return Immutable.fromJS({});
    };
    const store = createStore(reducer, Immutable.fromJS({}));
    const result = render(<Provider store={store}><DeliverableList {...props} /></Provider>);

    expect(result.text()).to.be.eq('ACTIONWrite the DeliverableList spec.\n??');
    // expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });
});
