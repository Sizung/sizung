import { render } from 'enzyme';
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
});
