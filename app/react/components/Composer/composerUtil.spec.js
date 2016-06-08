import { assert } from 'chai';
import {
  EditorState,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { clearEditorContent } from './composerUtil';

describe('_handleReturn test suite', () => {
  xit('should clear editor content when enter is clicked', () => {
    const contentBlocks = convertFromHTML(
      '<h1>aaaaaaaaaa</h1><h1>aaaaaaaaaa</h1>'
    );
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    clearEditorContent(editorState);
    assert.equal(this.state.editorState.getCurrentContent().getPlainText().length, 0);
  });
});
