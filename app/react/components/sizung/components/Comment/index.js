// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from './../User'
import { DropdownButton, Dropdown, Menu, MenuItem, Toggle, Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class Comment extends React.Component {
  constructor() {
    super();
    this.state = {
      hover: false
    };

    this.handleDeleteClick = (e) => {
      e.preventDefault();
      this.props.deleteComment(this.props.comment.id);
    }
  }

  toggleHover() {
    this.setState({hover: !this.state.hover});
  }

  handleAgendaItem(e){
    //console.log("Comment body: " + this.props.comment.body);
    e.preventDefault();
    this.commentBodyNode = this.refs.commentBody.getDOMNode();
    this.commentBody = $(this.commentBodyNode).text();
    if(!this.commentBody) return;
    this.props.createAgendaItem({conversation_id: this.props.comment.parent.id, title: this.commentBody});
    this.toggleHover();
  }

  handleDeliverable(e){
    e.preventDefault();
    this.commentBodyNode = this.refs.commentBody.getDOMNode();
    this.commentBody = $(this.commentBodyNode).text();
    if(!this.commentBody) return;
    this.props.createDeliverable({agenda_item_id: this.props.comment.parent.id, title: this.commentBody});
    this.toggleHover();
  }

  render() {
    const {author, body, createdAt, id, canCreateAgendaItem, canCreateDeliverable} = this.props.comment;

    var commentActions = [];
    if (canCreateAgendaItem) {
      commentActions.push(<MenuItem onSelect={this.handleAgendaItem.bind(this)}>Escalate as Agenda Item</MenuItem>);
    }
    if (canCreateDeliverable) {
      commentActions.push(<MenuItem onSelect={this.handleDeliverable.bind(this)}>Escalate as Deliverable</MenuItem>);
    }

    var hoverStyle = (this.state.hover ? 'on-mouse-over' : 'on-mouse-out');
    return  <div styleName={'root-' + hoverStyle} onMouseOver={this.toggleHover.bind(this)} onMouseOut={this.toggleHover.bind(this)}>
      <div styleName='user-container'>
        <User user={author} />
      </div>
      <div styleName='content-container'>
        <div styleName={'options-' + hoverStyle}>
          <div styleName='delete-option'>
            <Dropdown id={"settings-dropdown-"+id} styleName='settings-dropdown' ref='settingsDropdown' pullRight>
              <Dropdown.Toggle bsStyle='link' bsSize="small" noCaret>
                <i styleName='gear-icon'></i>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ position: 'absolute', top: '0px', right: '0px', zIndex: '99999'}}>
                <MenuItem onSelect={this.handleDeleteClick}>
                  Delete Comment
                </MenuItem>
                {commentActions}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <span ref='commentBody'>
          {body}
        </span>
        <div styleName='time-container'>
          <small><Time value={createdAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
        </div>
      </div>
    </div>;
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