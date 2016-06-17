import React, { PropTypes } from 'react';
import styles from './Composer.css';

import { clearEditorContent, suggestionsFilter } from './composerUtil';
import Editor from 'draft-js-plugins-editor';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin from 'draft-js-mention-plugin';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
import Immutable from 'immutable';
import { toContentState, toMarkdown } from '../../utils/markdownUtils';

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
    scrollListToBottom: PropTypes.func,
  };

  static defaultProps = {
    value: '',
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
    const contentState = toContentState(props.value);
    const editorState = EditorState.createWithContent(contentState);

    this.state = {
      editorState,
    };
    this.mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '',
    });
    this.MentionSuggestions = this.mentionPlugin.MentionSuggestions;
    this.plugins = [this.mentionPlugin];
    this.setSuggestion('', props.mentions);
  }

  componentWillReceiveProps(properties) {
    if (properties.mentions !== this.props.mentions) {
      this.setSuggestion(this.state.filterText, properties.mentions);
    }
  }

  componentDidUpdate() {
    this.props.scrollListToBottom();
  }

  onSearchChange = ({ value }) => {
    this.setState({
      filterText: value,
    });
    this.setSuggestion(value, this.props.mentions);
  };

  getMarkdown = () => {
    const contentState = this.state.editorState.getCurrentContent();
    if (contentState.hasText()) {
      return toMarkdown(contentState).trim();
    }
    return null;
  }

  /**
  * The function will derive the suggestion to be used for mentionsPlugin,
  * it will use the filterText and mentions for the purpose.
  * Form the prespective of optimizing the render function the function is not called in each render cycle,
  * but only when state.filterText or props.mentions change and suggestions are saved as a value in variable this.
  */
  setSuggestion = (filterText, mentions) => {
    const suggestions = Immutable.fromJS(mentions);
    this.suggestions = suggestionsFilter(filterText, suggestions);
  }

  handleChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.onChange(editorState.getCurrentContent());
  };

  hasText = () => {
    const plainText = this.state.editorState.getCurrentContent().getPlainText();
    const trimmedPlainText = plainText.trim().replace(/\s*/g, '');
    return trimmedPlainText.length > 0;
  }

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
     const trimmedText = plainText && plainText.trim();
     if (!e.shiftKey && trimmedText && trimmedText.length > 0 && !this.mentionSuggestionOpen) {
       this.props.onSubmit(toMarkdown(contentState), plainText);
       this.handleChange(clearEditorContent(editorState));
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
    const { editorState } = this.state;
    const { placeholder } = this.props;
    const { suggestions } = this;
    return (
      <div className={styles.root}>
        <Editor editorState={editorState}
                onChange={this.handleChange}
                handleKeyCommand={this.handleKeyCommand}
                plugins={this.plugins}
                placeholder={placeholder}
                handleReturn={this._handleReturn}
        />
        <this.MentionSuggestions
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
