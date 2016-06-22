import { EditorState, Modifier, RichUtils } from 'draft-js';

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

/**
* Function returns collection of currently selected blocks.
*/
export function getSelectedBlocksMap(editorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]]);
}

/**
* Function returns collection of currently selected blocks.
*/
export function getSelectedBlocksList(editorState) {
  return getSelectedBlocksMap(editorState).toList();
}

export function addListForListKeyCombinations(editorState) {
  let newEditorState = editorState;
  const blocks = getSelectedBlocksList(editorState);
  if (blocks.size === 1) {
    const currentBlock = blocks.get(0);
    const blockText = currentBlock.getText();
    if ((blockText.length === 3 && blockText.startsWith('* ')) ||
      (blockText.length === 4 && blockText.startsWith('1. '))) {
      const blockType = blockText.startsWith('* ') ? 'unordered-list-item' : 'ordered-list-item';
      const updatedSelection = editorState.getSelection().merge({
        anchorKey: currentBlock.get('key'),
        anchorOffset: 0,
        focusKey: currentBlock.get('key'),
        focusOffset: blockText.length - 1,
        isBackward: false,
      });
      const newContentState = Modifier.replaceText(
          editorState.getCurrentContent(),
          updatedSelection,
          ''
        );
      newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
      newEditorState = RichUtils.toggleBlockType(
        newEditorState,
        blockType
      );
      newEditorState = EditorState.moveFocusToEnd(newEditorState);
    }
  }
  return newEditorState;
}
