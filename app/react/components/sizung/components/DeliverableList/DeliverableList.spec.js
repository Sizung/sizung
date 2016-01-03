import { expect } from 'chai';
import Immutable from 'immutable';
import { shallow } from 'enzyme';
import hook from 'css-modules-require-hook';
import React from 'react';

//import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import DeliverableList from './index';

describe ('DeliverableList', () => {
  it('lists one single deliverable', () => {
    const props = {
      deliverables: [{id: '123', title: 'Write the DeliverableLiec.', status: 'open'}]
    };
    const result = shallow(<DeliverableList {...props} />);

    expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });
});

