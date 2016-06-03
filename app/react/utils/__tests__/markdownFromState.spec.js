const { describe, it } = global;
import expect from 'expect';
import stateFromMarkdown from '../stateFromMarkdown';
import markdownFromState from '../markdownFromState';

describe('markdownFromState', () => {
  it('simple line', () => {
    const contentState    = stateFromMarkdown('Hello World');
    const markdown        = markdownFromState(contentState);

    expect(markdown).toEqual('Hello World');
  });

  it('link', () => {
    const contentState    = stateFromMarkdown('This is a [link](www.example.com)');
    const markdown        = markdownFromState(contentState);

    expect(markdown).toEqual('This is a [link](www.example.com)');
  });

  it('create mention', () => {
    const contentState    = stateFromMarkdown('Hello @[Günter Glück](123abc)');
    const markdown        = markdownFromState(contentState);

    expect(markdown).toEqual('Hello @[Günter Glück](123abc)');
  });
});

