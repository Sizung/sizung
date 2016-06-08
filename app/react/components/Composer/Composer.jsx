import React, { PropTypes } from 'react';
import styles from './Composer.css';

import Editor from 'draft-js-plugins-editor';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { EditorState, RichUtils, convertToRaw, Modifier } from 'draft-js';
import Immutable from 'immutable';
import stateFromMarkdown from '../../utils/stateFromMarkdown';
import markdownFromState from '../../utils/markdownFromState';

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  mentionPrefix: '',
});
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

class Composer extends React.Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    mentions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired
    ),
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: 'default Text',
    mentions: [
      {
        name: 'Günter Glück',
        id: '1',
        avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
      },
      {
        name: 'Sam Sample',
        id: '2',
        avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
      },
    ],
    onSubmit: (markdownText) => {
      console.log(markdownText);
    },
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    const contentState = stateFromMarkdown(props.value);
    const editorState = EditorState.createWithContent(contentState);
    const suggestions = Immutable.fromJS(props.mentions);

    this.state = {
      editorState,
      suggestions,
    };
  }

  getMarkdown = () => {
    const contentState = this.state.editorState.getCurrentContent();
    if (contentState.hasText()) {
      return markdownFromState(contentState).trim();
    }
    return null;
  }

  hasText = () => {
    const plainText = this.state.editorState.getCurrentContent().getPlainText();
    const trimmedPlainText = plainText.trim().replace(/\s*/g, '');
    return trimmedPlainText.length > 0;
  }

  handleChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.onChange(editorState);
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.state.suggestions),
    });
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.handleChange(newState);
      return true;
    }
    return false;
  };

  _handleBoldClick = () => {
    this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

   _handleReturn = (e) => {
     const { editorState } = this.state;
     const contentState = editorState.getCurrentContent();
     const plainText = contentState.getPlainText();
     if (!e.shiftKey && contentState.hasText() && !this.mentionSuggestionOpen) {
       this.props.onSubmit(markdownFromState(contentState), plainText);
       const blocks = editorState.getCurrentContent().getBlockMap().toList();
       const updatedSelection = editorState.getSelection().merge({
         anchorKey: blocks.first().get('key'),
         anchorOffset: 0,
         focusKey: blocks.last().get('key'),
         focusOffset: blocks.last().getLength(),
       });
       const newContentState = Modifier.removeRange(
         editorState.getCurrentContent(),
         updatedSelection,
         'forward'
       );
       const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
       this.handleChange(newEditorState);
       return true;
     }
     return false;
   };

  _handleLogClick = () => {
    const contentState = this.state.editorState.getCurrentContent();
    console.log('raw: ', convertToRaw(contentState));
  };

  _mentionSuggestionsOpen = () => {
    this.mentionSuggestionOpen = true;
  }

  _mentionSuggestionsClose = () => {
    this.mentionSuggestionOpen = false;
  }

  render() {
    const { editorState, suggestions } = this.state;
    const { placeholder } = this.props;

    return (
      <div className={styles.root}>
        <Editor editorState={editorState}
                onChange={this.handleChange}
                handleKeyCommand={this.handleKeyCommand}
                plugins={plugins}
                placeholder={placeholder}
                handleReturn={this._handleReturn}
        />
        <MentionSuggestions
            onSearchChange={ this.onSearchChange }
            suggestions={ suggestions }
            onOpen={this._mentionSuggestionsOpen}
            onClose={this._mentionSuggestionsClose}
        />
      </div>
    );
  }
}

export default Composer;
