import { assert } from 'chai';
import {
  EditorState,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { clearEditorContent, suggestionsFilter } from './composerUtil';
import Immutable from 'immutable';

describe('clearEditorContent test suite', () => {
  it('should clear editor content', () => {
    const contentBlocks = convertFromHTML(
      '<h1>aaaaaaaaaa</h1><h1>aaaaaaaaaa</h1>'
    );
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    let editorState = EditorState.createWithContent(contentState);
    editorState = clearEditorContent(editorState);
    assert.equal(editorState.getCurrentContent().getPlainText().length, 0);
  });
});

describe('suggestionsFilter test suite', () => {
  it('should filter out suggestions with blank name', () => {
    const mentions = Immutable.fromJS([{
      name: 'abc',
    }, {
      name: '',
    }]);
    const suggestions = suggestionsFilter('', mentions);
    assert.equal(suggestions.size, 1);
  });
});
