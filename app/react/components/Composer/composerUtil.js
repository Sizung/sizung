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

function getSelectedBlocksMap(editorState) {
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

function getSelectedBlocksList(editorState) {
  return getSelectedBlocksMap(editorState).toList();
}

function getSelectedBlock(editorState) {
  if (editorState) {
    return getSelectedBlocksList(editorState).get(0);
  }
  return undefined;
}

function addLineBreakRemovingSelection(editorState: EditorState): EditorState {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let newContent = Modifier.removeRange(content, selection, 'forward');
  const fragment = newContent.getSelectionAfter();
  const currentClock = newContent.getBlockForKey(fragment.getStartKey());
  newContent = Modifier.insertText(
    newContent,
    fragment,
    '\n',
    currentClock.getInlineStyleAt(fragment.getStartOffset()),
    null,
  );
  return EditorState.push(editorState, newContent, 'insert-fragment');
}

function addNewListBlocks(editorState) {
  let newState = editorState;
  const selectedBlock = getSelectedBlock(newState);

  const removeRangeLength = selectedBlock.getText().startsWith('* ') ? 2 : 3;
  const blockType = selectedBlock.getText().startsWith('* ') ? 'unordered-list-item' : 'ordered-list-item';

  // remove '* ' or '1. ' from beginning of block
  let updatedSelection = newState.getSelection().merge({
    anchorKey: selectedBlock.get('key'),
    anchorOffset: 0,
    focusKey: selectedBlock.get('key'),
    focusOffset: removeRangeLength,
    isBackward: false,
  });
  let newContentState = Modifier.removeRange(
    editorState.getCurrentContent(),
    updatedSelection,
    'forward'
  );
  newState = EditorState.push(newState, newContentState, 'remove-range');

  // move seleciton back to end of block
  updatedSelection = newState.getSelection().merge({
    anchorKey: selectedBlock.get('key'),
    anchorOffset: selectedBlock.getLength(),
    focusKey: selectedBlock.get('key'),
    focusOffset: selectedBlock.getLength(),
    isBackward: false,
  });
  newState = EditorState.acceptSelection(newState, updatedSelection);

  // toggle block type
  newState = RichUtils.toggleBlockType(
    newState,
    blockType
  );

  // split block
  newContentState = Modifier.splitBlock(
    newState.getCurrentContent(),
    newState.getSelection()
  );

  return EditorState.push(newState, newContentState, 'split-block');
}

export function handleSoftNewLine(editorState) {
  const selectedBlock = getSelectedBlock(editorState);
  if (selectedBlock.type !== 'unordered-list-item' && selectedBlock.type !== 'ordered-list-item') {
    let newState = editorState;
    if (selectedBlock.getText().startsWith('* ') || selectedBlock.getText().startsWith('1. ')) {
      newState = addNewListBlocks(newState);
    } else {
      const selection = newState.getSelection();
      if (selection.isCollapsed()) {
        newState = RichUtils.insertSoftNewline(newState);
      } else {
        newState = addLineBreakRemovingSelection(newState);
      }
    }
    return newState;
  }
}
