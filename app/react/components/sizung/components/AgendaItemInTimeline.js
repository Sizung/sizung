// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from './User'

function SelectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

class AgendaItemInTimeline extends React.Component {
  constructor() {
    super();
    this.state = {edit: false};

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleEditClick(e) {
    e.preventDefault();
    this.setState({edit: {title: this.props.agendaItem.title }})
  }

  handleSaveClick(e) {
    e.preventDefault();

    var inputElem = React.findDOMNode(this.refs.input);
    const title = inputElem.value.trim();
    if(!title) return;

    this.props.updateAgendaItem(this.props.agendaItem.id, {title: title});
    this.setState({edit: false})
  }

  titleElement(persistedTitle) {
    if (this.state.edit && this.state.edit.title) {
      return <div><form onClick={this.handleSaveClick}><input type="text" ref="input" defaultValue={persistedTitle} style={{width: '400px'}}/><button type="submit">Save</button></form></div>
    }
    else {
      return <span>{persistedTitle}<a href="#" onClick={this.handleEditClick}><i className="fa fa-pencil" style={{marginLeft: '1em'}} /></a></span>;
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

    return  <div style={{marginTop: '1em'}} className="col-xs-12 margin-xs-vertical">
              <div className="col-xs-1">
                <User user={agendaItem.owner} />
              </div>
              <div className="col-xs-11 zero-padding">
                {titleElement}
                <i className="fa fa-tag" style={{marginLeft: '3em'}} />
                <div className="pull-left col-xs-12 zero-padding margin-xs-vertical text-muted">
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