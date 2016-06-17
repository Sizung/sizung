const { describe, it } = global;
import expect from 'expect';
import { toMarkdown, toContentState } from '../markdownUtils';

describe('toMarkdown', () => {
  it('simple line', () => {
    const contentState    = toContentState('Hello World');
    const markdown        = toMarkdown(contentState);

    expect(markdown).toEqual('Hello World');
  });

  it('link', () => {
    const contentState    = toContentState('This is a [link](www.example.com)');
    const markdown        = toMarkdown(contentState);

    expect(markdown).toEqual('This is a [link](www.example.com)');
  });

  it('create mention', () => {
    const contentState    = toContentState('Hello @[Günter Glück](123abc)');
    const markdown        = toMarkdown(contentState);

    expect(markdown).toEqual('Hello @[Günter Glück](123abc)');
  });
});

