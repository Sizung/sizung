import draft, { Modifier, Entity, SelectionState } from 'draft-js';
import Immutable from 'immutable';

const mentionPattern = new RegExp(/(.*)@\[([^\]]*)\]\(([^\)]*)\)(.*)/);

const getMentionRange = (text) => {
  const result = text.match(mentionPattern);
  if (!result) { return null; }

  const start = result[1].length;
  const name  = result[2];
  const id    = result[3];
  const end   = start + name.length + id.length + 5;
  return [start, end, name, id];
};

const replaceTokens = (contentState) => {
  const blocks = contentState.getBlocksAsArray();

  for (const contentBlock of blocks) {
    const key = contentBlock.getKey();
    const mentionRange = getMentionRange(contentBlock.getText());
    if (mentionRange) {
      const selection = new SelectionState({
        anchorKey: key,
        anchorOffset: mentionRange[0],
        focusKey: key,
        focusOffset: mentionRange[1],
      });

      const data = { mention: new Immutable.Map({ name: mentionRange[2], id: mentionRange[3] }) };
      const mentionEntityKey = Entity.create('mention', 'IMMUTABLE', data);

      const mentionReplacedContentState = Modifier.replaceText(
        contentState,
        selection,
        mentionRange[2],
        null, // no inline style needed
        mentionEntityKey
      );

      return replaceTokens(mentionReplacedContentState);
    }
  }
  return contentState;
};

const stateFromMarkdown = (markdown) => {
  const contentState = draft.ContentState.createFromText(markdown);
  return replaceTokens(contentState);
};

export default stateFromMarkdown;
