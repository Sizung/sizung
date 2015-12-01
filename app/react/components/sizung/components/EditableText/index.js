import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

function SelectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

@CSSModules(styles)
class EditableText extends React.Component {
  constructor() {
    super();
    this.state = {edit: false};

    this.saveEdit         = this.saveEdit.bind(this);
    this.cancelEdit       = this.cancelEdit.bind(this);

    this.handleEditClick  = this.handleEditClick.bind(this);
    this.handleKeyDown    = this.handleKeyDown.bind(this);
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.handleBlur       = this.handleBlur.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
  }

  saveEdit() {
    var inputElem = React.findDOMNode(this.refs.input);
    const title = inputElem.value.trim();
    if(!title) return;

    this.props.onUpdate(title);
    this.setState({edit: false})
  }

  cancelEdit() {
    this.setState({edit: false})
  }

  handleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({edit: true})
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.cancelEdit();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.saveEdit();
  }

  handleBlur(e) {
    e.preventDefault();
    this.saveEdit();
  }

  handleInputClick(e) {
    e.stopPropagation();
  }

  editLink(editable) {
    if (editable) {
      return <a styleName="edit-link" href="#" onClick={this.handleEditClick}><i className="fa fa-pencil" style={{marginLeft: '1em'}} /></a>;
    }
  }

  textElement(persistedText, editable) {
    if (this.state.edit) {
      return <div styleName='edit-text-container'><form styleName='edit-text-form' onSubmit={this.handleSubmit}><input type="text" ref="input" onClick={this.handleInputClick} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} defaultValue={persistedText} styleName='edit-text-input'/></form></div>
    }
    else {
      return <div styleName='persisted-text-container'>{persistedText} {this.editLink(editable)}</div>;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.edit && !prevState.edit) {
      //var inputElem = ReactDOM.findDOMNode(this.refs.input);
      var inputElem = React.findDOMNode(this.refs.input);
      inputElem.focus();
      SelectInputText(inputElem);
    }
  }

  render() {
    return this.textElement(this.props.text, this.props.editable);
  }
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  editable: PropTypes.bool
};

EditableText.defaultProps = {
  editable: true
};

export default EditableText;