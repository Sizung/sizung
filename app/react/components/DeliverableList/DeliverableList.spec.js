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
        owner: { firstName: 'Guenter', lastName: 'Glueck', email: 'gugl@guenterglueck.com', presenceStatus: 'offline' },
        parent: { id: '1', type: 'agendaItems' },
      }]),
      visitDeliverable: noOp,
      updateDeliverable: noOp,
      currentTimeline: 'organization',
      currentUser: { firstName: 'Guenter', lastName: 'Glueck', email: 'gugl@guenterglueck.com', presenceStatus: 'offline' },
    };

    const reducer = (currentState, action) => {
      return Immutable.fromJS({});
    };
    const store = createStore(reducer, Immutable.fromJS({}));
    const result = render(<Provider store={store}><DeliverableList {...props} /></Provider>);

    expect(result.text()).to.be.eq('ACTIONAll ActionsMy ActionsWrite the DeliverableList spec.\n??');
    // expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });

  it('displays appropriate deliverable filter options', () => {
    const noOp = () => {};
    let props = {
      deliverables: new Immutable.List([{
        id: '123',
        title: 'Ani assigns Bob',
        status: 'open',
        commentsCount: 0,
        assignee: { firstName: 'Bob', lastName: 'B', email: 'bob@sizung.com', presenceStatus: 'offline' },
        owner: { firstName: 'Ani', lastName: 'A', email: 'ani@sizung.com', presenceStatus: 'offline' },
        parent: { id: '1', type: 'agendaItems' },
      }, {
        id: '124',
        title: 'Chris assigns Ani',
        status: 'open',
        commentsCount: 0,
        assignee: { firstName: 'Ani', lastName: 'A', email: 'ani@sizung.com', presenceStatus: 'offline' },
        owner: { firstName: 'Chris', lastName: 'C', email: 'chris@sizung.com', presenceStatus: 'offline' },
        parent: { id: '1', type: 'agendaItems' },
      }, {
        id: '125',
        title: 'Bob assigns Chris',
        status: 'open',
        commentsCount: 0,
        assignee: { firstName: 'Chris', lastName: 'C', email: 'chris@sizung.com', presenceStatus: 'offline' },
        owner: { firstName: 'Bob', lastName: 'B', email: 'bob@sizung.com', presenceStatus: 'offline' },
        parent: { id: '1', type: 'agendaItems' },
      }]),
      visitDeliverable: noOp,
      updateDeliverable: noOp,
      currentTimeline: 'organization',
      currentUser: { firstName: 'Ani', lastName: 'A', email: 'gugl@guenterglueck.com', presenceStatus: 'offline' },
    };

    const reducer = (currentState, action) => {
      return Immutable.fromJS({});
    };
    const store = createStore(reducer, Immutable.fromJS({}));
    let result = mount(<Provider store={store}><DeliverableList {...props} /></Provider>);

    expect(result.text()).to.be.eq('ACTIONAll ActionsMy ActionsAni assigns Bob\n??Chris assigns Ani\n??Bob assigns Chris\n??');
    
    props.currentTimeline = 'conversation';
    result = render(<Provider store={store}><DeliverableList {...props} /></Provider>);

    expect(result.text()).to.be.eq('ACTIONTeam ActionsMy ActionsAni assigns Bob\n??Chris assigns Ani\n??Bob assigns Chris\n??');
  });
});
