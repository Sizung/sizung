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
    onSubmit: PropTypes.func,
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

  //  _handleReturn = (e) => {
  //    const contentState = this.state.editorState.getCurrentContent();
  //    const plainText = contentState.getPlainText();
  //    if (!e.shiftKey && contentState.hasText()) {
  //      this.props.onSubmit(markdownFromState(contentState), plainText);
  //      window.setTimeout(() => {
  //        const emptyContentState = EditorState.createEmpty().getCurrentContent();
  //        const newEditorState    = EditorState.push(this.state.editorState, emptyContentState, 'apply-entity');
  //        this.onChange(newEditorState);
  //      }, 2000);
  //      return false;
  //    }
  //    return false;
  //  };

  _handleLogClick = () => {
    const contentState = this.state.editorState.getCurrentContent();
    console.log('raw: ', convertToRaw(contentState));
  };

  _handleSubmitClick = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    if (contentState.hasText()) {
      this.props.onSubmit(markdownFromState(contentState), plainText);
      const emptyContentState = EditorState.createEmpty().getCurrentContent();
      const newEditorState    = EditorState.push(this.state.editorState, emptyContentState, 'apply-entity');
      this.onChange(newEditorState);
    }
  };

  render() {
    const { editorState, suggestions } = this.state;
    const { placeholder } = this.props;

    return (
      <div className={styles.root}>
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
        <button onClick={this._handleSubmitClick}>Submit</button>
      </div>
    );
  }
}

export default Composer;
