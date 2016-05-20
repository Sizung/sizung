import React, { PropTypes } from 'react';
import styles from './index.css';
import SizungInputApp from '../../containers/SizungInputApp';
import TextWithMentions from '../TextWithMentions';
import EditIcon from '../EditIcon';

class EditableText extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    inverted: PropTypes.bool,
    backgroundHover: PropTypes.bool, //enable this when you want a in built hover on editable text
  };

  static defaultProps = {
    editable: true,
  };

  constructor() {
    super();
    this.state = { edit: false };
  }

  saveEdit = (value) => {
    const title = value.trim();
    if (!title) return;

    this.props.onUpdate(title);
    this.setState({ edit: false });
  }

  cancelEdit = () => {
    this.setState({ edit: false });
  }

  handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ edit: true });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.cancelEdit();
    }
  }

  handleSubmit = (value) => {
    this.saveEdit(value);
  }

  handleBlur = (e, value) => {
    e.preventDefault();
    this.saveEdit(value);
  }

  handleInputClick = (e) => {
    e.stopPropagation();
  }

  editLink = (editable) => {
    const { inverted } = this.props;

    if (editable) {
      return (
        <a className={styles.editLink} href="#">
          <EditIcon inverted={inverted} />
        </a>
      );
    }
  }

  textElement = (persistedText, editable) => {
    if (this.state.edit) {
      return (
        <div className={styles.editTextContainer}>
          <SizungInputApp ref="input" className="form-control" className={styles.editTextInput} onKeyDown={this.handleKeyDown} onSubmit={this.handleSubmit} onBlur={this.handleBlur} defaultValue={persistedText} maxLength={this.props.maxLength}/>
        </div>
      );
    }

    const persistedTextStyle = this.props.inverted ? styles.persistedTextInverted : styles.persistedText;
    return (
      <div className={styles.persistedTextContainer}  onClick={editable ? this.handleEditClick : null }>
        <div className={persistedTextStyle}>
          <span className={ (this.props.backgroundHover ? styles.textHoverContainer : '') }>
            <TextWithMentions maxLength={this.props.maxLength}>{persistedText}</TextWithMentions>
          </span>
          <div className={styles.editLinkContainer}>
            {this.editLink(editable)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { text, editable } = this.props;

    return this.textElement(text, editable);
  }
}

export default EditableText;

