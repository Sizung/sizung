import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import MarkupIt from 'markup-it';
import markdownSyntax from 'markup-it/syntaxes/markdown';

const markdown = new MarkupIt(markdownSyntax);

const toEditorState = (markdownText) => {
  const content      = markdown.toContent(markdownText);
  const rawContent   = MarkupIt.DraftUtils.encode(content);
  const blocks       = convertFromRaw(rawContent);
  const contentState = ContentState.createFromBlockArray(blocks.getBlocksAsArray());
  const editorState  = EditorState.createWithContent(contentState);

  return editorState;
};

const toMarkdown = (editorState) => {
  const content    = editorState;
  const rawContent = convertToRaw(content.getCurrentContent());
  const mdContent  = MarkupIt.DraftUtils.decode(rawContent);
  const text       = markdown.toText(mdContent);

  return text;
};

export {
  toEditorState,
  toMarkdown,
};
