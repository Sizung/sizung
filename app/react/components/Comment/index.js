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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.lastUpdatedTime = this.lastUpdatedTime.bind(this);
    this.renderCommentSettingsOptions = this.renderCommentSettingsOptions.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleAgendaItem(e){
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

  handleSubmit(){
    var commentText = React.findDOMNode(this.refs.input).value.trim();
    this.props.updateComment({id: this.props.comment.id, commentable_id: this.props.comment.parent.id, commentable_type: this.props.comment.parent.type, body: commentText});
    this.closeEditForm();
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
              <div className="btn btn-sm btn-success" onClick={this.handleSubmit} style={{ marginRight: "5px"}}>Save</div>
              <div className="btn btn-sm btn-default" onClick={this.closeEditForm}>Cancel</div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  lastUpdatedTime() {
    const {createdAt, updatedAt} = this.props.comment;
    var lastUpdatedAt = ( createdAt != updatedAt ? updatedAt : createdAt);
    var editedIndicator = ( createdAt != updatedAt ? "Edited " : "");
    return(<div styleName='time-container'>
      <small>{editedIndicator}<Time value={lastUpdatedAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
    </div>);
  }

  renderCommentSettingsOptions() {
    const {author, canCreateAgendaItem, canCreateDeliverable, id} = this.props.comment;
    var commentActions = [];
    if (canCreateAgendaItem) {
      commentActions.push(<li key={id + 'escalateAsAgendaItem'}><a href='#' onClick={this.handleAgendaItem.bind(this)}>Escalate as Agenda Item</a></li>);
    }
    if (canCreateDeliverable) {
      commentActions.push(<li key={id + 'escalateAsDeliverable'}><a href='#' onClick={this.handleDeliverable.bind(this)}>Escalate as Deliverable</a></li>);
    }
    if ( this.props.currentUser.id === author.id ){
      commentActions.push(<li key={id + 'editComment'}><a href="#" onClick={this.openEditForm}>Edit Comment</a></li>);
      commentActions.push(<li key={id + 'deleteComment'}><a href="#" onClick={this.handleDeleteClick}>Delete Comment</a></li>);
    }
    return commentActions;
  }

  handleScroll() {
    var node = React.findDOMNode(this.refs.gearDropDown);
    if (node){
      this.props.handleCommentSettingsDropdownScroll(node);
    }
  }

  renderShowComment() {
    const {body} = this.props.comment;
    var _this = this;
    return(<div styleName='content-container'>
        <div styleName='options-menu'>
          <div className="btn-group">
            <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={_this.handleScroll}>
              <i styleName='gear-icon'></i>
            </a>
            <ul ref="gearDropDown" className="dropdown-menu dropdown-menu-right">
              {this.renderCommentSettingsOptions()}
            </ul>
          </div>
        </div>
        <div styleName='comment-body' ref='commentBody'>
          {body}
        </div>
          {this.lastUpdatedTime()}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.state.edit ) {
      React.findDOMNode(this.refs.input).focus();
    }
  }

  render() {
    const {author, body, unseen} = this.props.comment;
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
    updatedAt: PropTypes.string.isRequired,
    canCreateAgendaItem: PropTypes.bool.isRequired,
    canCreateDeliverable: PropTypes.bool.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
  }).isRequired,
  currentUser: PropTypes.object.isRequired,
  handleCommentSettingsDropdownScroll: PropTypes.func.isRequired
};

export default Comment;