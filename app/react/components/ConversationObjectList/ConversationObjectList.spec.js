import { expect } from 'chai';
import Immutable from 'immutable';
import { render } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
// import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js
import ConversationObjectList from './index';

describe('ConversationObjectList', () => {
  it('renders with minimum data', () => {
    const noOp = () => {};

    const props = {
      commentForm: {
        parent: {
          type: 'conversations',
        },
      },
      visitAgendaItem: noOp,
      selectAgendaItem: noOp,
      updateAgendaItem: noOp,
      markAsSeen: noOp,
      createTimeTrack: noOp,
      updateTimeTrack: noOp,
    };

    const reducer = () => { return Immutable.fromJS({}); };
    const store   = createStore(reducer, Immutable.fromJS({}));
    const result  = render(<Provider store={store}><ConversationObjectList {...props} /></Provider>);

    expect(result.text()).to.be.eq('0??Write your comment here');
  });
});
