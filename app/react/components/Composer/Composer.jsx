import React, { PropTypes } from 'react';
import styles from './Composer.css';

import { clearEditorContent } from './composerUtil';
import Editor from 'draft-js-plugins-editor';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
import Immutable from 'immutable';
import stateFromMarkdown from '../../utils/stateFromMarkdown';
import markdownFromState from '../../utils/markdownFromState';

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
    this.props.onChange(editorState.getCurrentContent());
  };

  onSearchChange = ({ value }) => {
    this.setState({
      filterText: value,
    });
    this.setSuggestion(value, this.props.mentions);
  };

  setSuggestion = (filterText, mentions) => {
    let suggestions = Immutable.fromJS(mentions);
    if (filterText) {
      suggestions = defaultSuggestionsFilter(filterText, suggestions);
    }
    this.suggestions = suggestions;
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
     if (!e.shiftKey && contentState.hasText() && !this.mentionSuggestionOpen) {
       this.props.onSubmit(markdownFromState(contentState), plainText);
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
            suggestions={ this.suggestions }
            onOpen={this._mentionSuggestionsOpen}
            onClose={this._mentionSuggestionsClose}
        />
      </div>
    );
  }
}

export default Composer;
