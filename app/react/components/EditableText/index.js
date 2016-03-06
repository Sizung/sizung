import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import SizungInputApp from '../../containers/SizungInputApp';
import TextWithMentions from '../TextWithMentions';
import EditIcon from '../EditIcon';

//function SelectInputText(element) {
//  element.setSelectionRange(0, element.value.length);
//}

@CSSModules(styles)
class EditableText extends React.Component {
  constructor() {
    super();
    this.state = { edit: false };

    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
  }

  //componentDidUpdate(prevProps, prevState) {
  //  if (this.state.edit && !prevState.edit) {
  //    const inputElem = ReactDOM.findDOMNode(this.refs.input);
  //    inputElem.focus();
  //    SelectInputText(inputElem);
  //  }
  //}

  saveEdit(value) {
    const title = value.trim();
    if (!title) return;

    this.props.onUpdate(title);
    this.setState({ edit: false });
  }

  cancelEdit() {
    this.setState({ edit: false });
  }

  handleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ edit: true });
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.cancelEdit();
    }
  }

  handleSubmit(value) {
    this.saveEdit(value);
  }

  handleBlur(e, value) {
    e.preventDefault();
    this.saveEdit(value);
  }

  handleInputClick(e) {
    e.stopPropagation();
  }

  editLink(editable) {
    if (editable) {
      return <a styleName="edit-link" href="#" onClick={this.handleEditClick}><EditIcon inverted={this.props.inverted}/></a>;
    }
  }

  // <TextareaAutosize ref="input" className='form-control' rows="1" styleName='edit-text-input' onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={persistedText}/>

  textElement(persistedText, editable) {
    if (this.state.edit) {
      return (
        <div styleName='edit-text-container'>
          <form className="form-horizontal">
            <div className="form-group" style={{ marginBottom: "5px"}}>
              <div className="col-xs-12">
                <SizungInputApp ref="input" className="form-control" styleName="edit-text-input" onKeyDown={this.handleKeyDown} onSubmit={this.handleSubmit} onBlur={this.handleBlur} defaultValue={persistedText} />
              </div>
            </div>
          </form>
        </div>
      );
    } else {
      const persistedTextStyle = this.props.inverted ? 'persisted-text-inverted' : 'persisted-text';
      return <div styleName='persisted-text-container'><div styleName={persistedTextStyle}><TextWithMentions maxLength={this.props.maxLength}>{persistedText}</TextWithMentions></div><div styleName='edit-link-container'>{this.editLink(editable)}</div></div>;
    }
  }

  render() {
    return this.textElement(this.props.text, this.props.editable);
  }
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  inverted: PropTypes.bool,
};

EditableText.defaultProps = {
  editable: true,
};

export default EditableText;
