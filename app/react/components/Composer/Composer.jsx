import React, { PropTypes } from 'react';
import styles from './Composer.css';

import Editor from 'draft-js-plugins-editor';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
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
    onReturn: PropTypes.function,
  };

  static defaultProps = {
    value: 'default Text',
    mentions: [
      {
        name: 'Matthew Russell',
        id: '111',
        avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
      },
    ],
    onReturn: (markdownText) => {
      console.log(markdownText);
    },
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

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.state.suggestions),
    });
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  _handleBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  _handleReturn = () => {
    this.props.onReturn(markdownFromState(this.state.editorState.getCurrentContent()));
    return false;
  };

  _handleLogClick = () => {
    const contentState = this.state.editorState.getCurrentContent();
    console.log('raw: ', convertToRaw(contentState));
  };

  render() {
    const { editorState, suggestions } = this.state;
    const { placeholder } = this.props;
    
    return (
      <div className={styles.root}>
        <button onClick={this._handleBoldClick}>Bold</button>
        <button onClick={this._handleLogClick}>Log</button>
        <Editor editorState={editorState}
                onChange={this.onChange}
                handleKeyCommand={this.handleKeyCommand}
                plugins={plugins}
                placeholder={placeholder}
                handleReturn={this._handleReturn}
        />
        <MentionSuggestions
            onSearchChange={ this.onSearchChange }
            suggestions={ suggestions }
        />
      </div>
    );
  }
}

export default Composer;
