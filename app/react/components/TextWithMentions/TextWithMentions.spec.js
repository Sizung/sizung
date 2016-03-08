import { expect } from 'chai';
import Immutable from 'immutable';
import { render } from 'enzyme';
import React from 'react';

import TextWithMentions from './TextWithMentions';

describe('TextWithMentions', () => {
  it('shows text with brackets', () => {
    const props = {
      children: 'before mention @[Sam Sample](123fafasf-asdfj3j3kf-j48) after mention ) after bracket',
    };

    const result = render(<TextWithMentions {...props} />);
    expect(result.text()).to.be.eq('before mention Sam Sample after mention ) after bracket\n');
  });
});
