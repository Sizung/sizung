// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from '../User'
import CSSModules from 'react-css-modules';
import styles from "./index.css";

function SelectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

@CSSModules(styles)
class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();
    this.state = {edit: false};

    this.saveEdit       = this.saveEdit.bind(this);
    this.cancelEdit       = this.cancelEdit.bind(this);

    this.handleEditClick  = this.handleEditClick.bind(this);
    this.handleKeyDown    = this.handleKeyDown.bind(this);
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.handleBlur       = this.handleBlur.bind(this);
  }

  saveEdit() {
    var inputElem = React.findDOMNode(this.refs.input);
    const title = inputElem.value.trim();
    if(!title) return;

    this.props.updateAgendaItem(this.props.agendaItem.id, {title: title});
    this.setState({edit: false})
  }

  cancelEdit() {
    this.setState({edit: false})
  }


  handleEditClick(e) {
    e.preventDefault();
    this.setState({edit: {title: this.props.agendaItem.title }})
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


  titleElement(persistedTitle) {
    if (this.state.edit && this.state.edit.title) {
      return <div><form onSubmit={this.handleSubmit}><input type="text" ref="input" onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} defaultValue={persistedTitle} style={{width: '400px'}}/></form></div>
    }
    else {
      return <span>{persistedTitle}<a styleName="edit-link" href="#" onClick={this.handleEditClick}><i className="fa fa-pencil" style={{marginLeft: '1em'}} /></a></span>;
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
    const { agendaItem } = this.props;
    const titleElement = this.titleElement(agendaItem.title);

    return  <div styleName="root">
              <div styleName="user-container">
              </div>
              <div styleName="content-container">
                <div styleName="title">{titleElement}</div>
                <i styleName="agenda-item-icon" />
                <div styleName="time-container">
                  <small><Time value={agendaItem.createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
                </div>
              </div>
            </div>;
  }
}

AgendaItemInTimeline.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  updateAgendaItem: PropTypes.func.isRequired
};

export default AgendaItemInTimeline;