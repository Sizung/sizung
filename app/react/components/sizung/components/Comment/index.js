// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import Time from 'react-time'
import User from './../User'
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

  render() {
    const {author, body, createdAt} = this.props.comment;

    var hoverStyle = (this.state.hover ? 'on-mouse-over' : 'on-mouse-out');
    return  <div styleName={'root-' + hoverStyle} onMouseOver={this.toggleHover.bind(this)} onMouseOut={this.toggleHover.bind(this)}>
              <div styleName='user-container'>
                <User user={author} />
              </div>
              <div styleName='content-container'>
                <div styleName={'options-' + hoverStyle}>
                    <span styleName='delete-option'>
                      <a href='#' onClick={this.handleDeleteClick}>
                        <i styleName='delete-icon' aria-label='Delete'></i>
                      </a>
                    </span>
                </div>
                {body}
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
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

export default Comment;