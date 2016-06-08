import { render, mount } from 'enzyme';
import { assert } from 'chai';
import { spy } from 'sinon';
import React from 'react';

// import { stub } from 'sinon'; ... to mock api calls https://github.com/pure-ui/react-pure-ui/blob/master/test/unit/components/BooleanControl.js

import Composer from './index';

describe('Composer', () => {
  it('presents the composer', () => {
    const noOp = () => {};
    const props = {
    };

    const result = render(<Composer {...props} />);
    // expect(result.text()).to.match(/Hello World/);
    // expect(result.contains(<div>Write the DeliverableList spec.</div>)).to.be.true;
  });

  it('imports and exports links', () => {
    const text = 'Hello **World**\n[URL and title](/url/ "title")\n';
    // const editorState = toEditorState(text);
    // console.log(editorState);
    // const exportedText = toMarkdown(editorState);
    // expect(exportedText).to.equal(text);
  });

  xit('should call props.onSubmit when enter key is pressed', () => {
    const onSubmit = spy();
    const editor = mount(<Composer onSubmit={onSubmit} />);
    editor.simulate('keypress', { which: 'Enter' });
    assert.isTrue(spy.calledOnce);
  });
});
