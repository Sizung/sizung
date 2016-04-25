import { expect } from 'chai';
import Immutable from 'immutable';
import { render } from 'enzyme';
import React from 'react';

// import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import Comment from './index';

describe('Comment', () => {
  it('presents a comment', () => {
    const noOp = () => {};
    const props = {
      comment: {
        id: '123',
        body: 'Hello World.',
        createdAt: '2015-12-01T11:18:29.121Z',
        updatedAt: '2015-12-01T11:18:29.121Z',
      },
      currentUser: {
        id: 1,
      },
    };

    const result = render(<Comment {...props} />);
    expect(result.text()).to.match(/Hello World/);
    // expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });
});

