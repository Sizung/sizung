import { EditorState, Modifier } from 'draft-js';

export function clearEditorContent(editorState) {
  const blocks = editorState.getCurrentContent().getBlockMap().toList();
  const updatedSelection = editorState.getSelection().merge({
    anchorKey: blocks.first().get('key'),
    anchorOffset: 0,
    focusKey: blocks.last().get('key'),
    focusOffset: blocks.last().getLength(),
    isBackward: false,
  });
  const newContentState = Modifier.removeRange(
    editorState.getCurrentContent(),
    updatedSelection,
    'forward'
  );
  return EditorState.push(editorState, newContentState, 'remove-range');
}

export function suggestionsFilter(searchValue, suggestions) {
  const value = searchValue && searchValue.toLowerCase();
  const filteredSuggestions = suggestions.filter((suggestion) => {
    const name = suggestion.get('name') && suggestion.get('name').trim();
    return name && name.length > 0 &&
      (!value || suggestion.get('name').toLowerCase().indexOf(value) > -1);
  });
  return filteredSuggestions;
}
