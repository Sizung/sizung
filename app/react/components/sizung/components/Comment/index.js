// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from './../User/index'
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class Comment extends React.Component {
  constructor() {
    super();

    this.state = {
      edit: false
    }

    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.comment.id);
    }

    this.closeEditForm = this.closeEditForm.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
  }

  handleAgendaItem(e){
    //console.log("Comment body: " + this.props.comment.body);
    e.preventDefault();
    this.commentBodyNode = this.refs.commentBody.getDOMNode();
    this.commentBody = $(this.commentBodyNode).text();
    if(!this.commentBody) return;
    this.props.createAgendaItem({conversation_id: this.props.comment.parent.id, title: this.commentBody});
  }

  handleDeliverable(e){
    e.preventDefault();
    this.commentBodyNode = this.refs.commentBody.getDOMNode();
    this.commentBody = $(this.commentBodyNode).text();
    if(!this.commentBody) return;
    this.props.createDeliverable({agenda_item_id: this.props.comment.parent.id, title: this.commentBody});
  }

  closeEditForm(){
    this.setState({ edit: false});
  }

  openEditForm(){
    this.setState({ edit: true});
  }

  renderEditComment(body) {
    return(<div styleName='content-container'>
        <form className="form-horizontal">
          <div className="form-group" style={{ marginBottom: "5px"}}>

            <div className="col-xs-12">
              <textarea ref='input' className="form-control" rows="3">{body}</textarea>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "5px"}}>
            <div className="col-xs-12">
              <div className="btn btn-sm btn-success" style={{ marginRight: "5px"}}>Save</div>
              <div className="btn btn-sm btn-default" onClick={this.closeEditForm}>Cancel</div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  renderShowComment() {
    const {author, body, createdAt, id, canCreateAgendaItem, canCreateDeliverable} = this.props.comment;
    console.log("renderShowComment");
    var commentActions = [];
    if (canCreateAgendaItem) {
      commentActions.push(<li key={id + 'escalateAsAgendaItem'}><a href='#' onClick={this.handleAgendaItem.bind(this)}>Escalate as Agenda Item</a></li>);
    }
    if (canCreateDeliverable) {
      commentActions.push(<li key={id + 'escalateAsDeliverable'}><a href='#' onClick={this.handleDeliverable.bind(this)}>Escalate as Deliverable</a></li>);
    }

    return(<div styleName='content-container'>
        <div styleName='options-menu'>
          <div className="btn-group">
            <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i styleName='gear-icon'></i>
            </a>
            <ul style={{ zIndex: '3000'}} className="dropdown-menu dropdown-menu-right">
              <li><a href="#" onClick={this.openEditForm}>Edit Comment</a></li>
              <li><a href="#" onClick={this.handleDeleteClick}>Delete Comment</a></li>
              {commentActions}
            </ul>
          </div>
        </div>
        <div styleName='comment-body' ref='commentBody'>
          {body}
        </div>
        <div styleName='time-container'>
          <small><Time value={createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    if ( this.state.edit ) {
      React.findDOMNode(this.refs.input).focus();
    }
  }

  render() {
    const {author, body} = this.props.comment;
    console.log("edit state: " + this.state.edit);
    return(<div styleName='root'>
        <div styleName='user-container'>
          <User user={author}/>
        </div>
        { this.state.edit ? this.renderEditComment(body) : this.renderShowComment() }
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
    canCreateAgendaItem: PropTypes.bool.isRequired,
    canCreateDeliverable: PropTypes.bool.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,

  }).isRequired,
};

export default Comment;