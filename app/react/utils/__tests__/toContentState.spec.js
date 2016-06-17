const { describe, it } = global;
import expect from 'expect';
import { toContentState } from '../markdownUtils';
import { convertToRaw } from 'draft-js';
import Immutable from 'immutable';

describe('toContentState', () => {
  const removeKeys = (blocks) => {
    return blocks.map((block) => {
      const { key, ...other } = block; // eslint-disable-line no-unused-vars
      return other;
    });
  };

  it('create content state', () => {
    const contentState    = toContentState('Hello World');
    const blocks          = removeKeys(convertToRaw(contentState).blocks);

    expect(blocks).toEqual(
      [{ text: 'Hello World', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [] }]
    );
  });

  it('create multiple lines', () => {
    const contentState    = toContentState('Hello World\n\nSecond line');
    const blocks          = removeKeys(convertToRaw(contentState).blocks);

    expect(blocks).toEqual(
      [
        { text: 'Hello World', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [] },
        { text: 'Second line', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [] },
      ]
    );
  });

  it('creates a mention', () => {
    const contentState    = toContentState('Hello @[Günter Glück](123abc)');
    const rawContentState = convertToRaw(contentState);
    const blocks          = removeKeys(rawContentState.blocks);

    expect(blocks).toEqual(
      [{ text: 'Hello Günter Glück', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [{ key: 0, offset: 6, length: 12 }] }]
    );

    const entityMap = rawContentState.entityMap;
    expect(entityMap['0'].data.mention.toJS()).toEqual(
      { id: '123abc', name: 'Günter Glück' }
    );
    expect(Immutable.fromJS(entityMap['0']).toJS()).toEqual(
      { data: { mention: { id: '123abc', name: 'Günter Glück' } }, mutability: 'IMMUTABLE', type: 'mention' }
    );
  });

  it('creates two mentions in one line', () => {
    const contentState    = toContentState('Hello @[Günter Glück](123abc) and @[Sam Sample](456def) how are you?');
    const rawContentState = convertToRaw(contentState);
    const blocks          = removeKeys(rawContentState.blocks);

    expect(blocks).toEqual(
      [{ text: 'Hello Günter Glück and Sam Sample how are you?', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [
        { key: 0, offset: 6, length: 12 },
        { key: 1, offset: 23, length: 10 },
      ] }]
    );

    const entityMap = rawContentState.entityMap;
    expect(Immutable.fromJS(entityMap['0']).toJS()).toEqual(
      { data: { mention: { id: '123abc', name: 'Günter Glück' } }, mutability: 'IMMUTABLE', type: 'mention' }
    );
    expect(Immutable.fromJS(entityMap['1']).toJS()).toEqual(
      { data: { mention: { id: '456def', name: 'Sam Sample' } }, mutability: 'IMMUTABLE', type: 'mention' }
    );
  });
});

