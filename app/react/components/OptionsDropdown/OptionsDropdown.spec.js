import React from 'react';
import { expect, assert } from 'chai';
import { shallow, mount } from 'enzyme';
import OptionsDropdown from './index';

describe('OptionsDropdown test suite', () => {
  it('should have edit false by default', () => {
    const options = [{
      label: 'Edit Comment',
      function: () => {},
    }, {
      label: 'Delete Comment',
      function: () => {},
    }];
    const optionsDropdown = mount(<OptionsDropdown options={options} />);
    assert.isNotTrue(optionsDropdown.state(), false);
  });

  it('should render in a div wrapper', () => {
    expect(shallow(
      <OptionsDropdown />
    ).node.type).to.equal('div');
  });
});
