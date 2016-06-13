import { stateToMarkdown } from 'draft-js-export-markdown';

const markdownFromState = (contentState) => {
  const md = stateToMarkdown(contentState);
  return md.replace(/\n$/, '');
};

export default markdownFromState;
