// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import Time from 'react-time';
import User from './../User/index';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions';
import SizungInputApp from '../../containers/SizungInputApp';

class Comment extends React.Component {
  constructor() {
    super();

    this.state = {
      edit: false,
    };
  }

  handleDeleteClick = (e) => {
    e.preventDefault();
    this.props.deleteComment(this.props.comment.id);
  };

  handleAgendaItem = (e) => {
    e.preventDefault();
    this.commentBodyNode = this.refs.commentBody;
    this.commentBody = $(this.commentBodyNode).text();
    if (!this.commentBody) return;
    this.props.createAgendaItem({ conversation_id: this.props.comment.parent.id, title: this.commentBody });
  };

  handleDeliverable = (e) => {
    e.preventDefault();
    this.commentBodyNode = this.refs.commentBody;
    this.commentBody = $(this.commentBodyNode).text();
    if (!this.commentBody) return;
    this.props.createDeliverable({ agenda_item_id: this.props.comment.parent.id, title: this.commentBody });
  };

  closeEditForm = () => {
    this.setState({ edit: false, value: null });
  };

  openEditForm = () => {
    this.setState({ edit: true });
  };

  handleSave = () => {
    const value = this.state.value || this.props.comment.body;
    this.handleSubmit(value);
  };

  handleChange = (ev, value) => {
    this.setState({ value });
  };

  handleSubmit = (value) => {
    const commentText = value.trim();
    this.props.updateComment({ id: this.props.comment.id, commentable_id: this.props.comment.parent.id, commentable_type: this.props.comment.parent.type, body: commentText });
    this.closeEditForm();
  };

  lastUpdatedTime = () => {
    const { createdAt, updatedAt } = this.props.comment;
    const lastUpdatedAt = (createdAt !== updatedAt ? updatedAt : createdAt);
    const editedIndicator = (createdAt !== updatedAt ? 'Edited ' : '');
    return (<div className={styles.timeContainer}>
      <small>{editedIndicator}<Time value={lastUpdatedAt} titleFormat="YYYY/MM/DD HH:mm" relative /></small>
    </div>);
  };


  handleScroll = () => {
    const node = this.refs.gearDropDown;
    if (node) {
      this.props.handleCommentSettingsDropdownScroll(node);
    }
  };

  renderCommentSettingsOptions = () => {
    const { author, canCreateAgendaItem, canCreateDeliverable, id } = this.props.comment;
    const commentActions = [];
    const _this = this;
    if (canCreateAgendaItem) {
      commentActions.push(<li key={id + 'escalateAsAgendaItem'}><a href="#" onClick={this.handleAgendaItem.bind(this)}>Escalate as Agenda Item</a></li>);
    }
    if (canCreateDeliverable) {
      commentActions.push(<li key={id + 'escalateAsDeliverable'}><a href="#" onClick={this.handleDeliverable.bind(this)}>Escalate as Deliverable</a></li>);
    }
    if (this.props.currentUser.id === author.id) {
      commentActions.push(<li key={id + 'editComment'}><a href="#" onClick={this.openEditForm}>Edit Comment</a></li>);
      commentActions.push(<li key={id + 'deleteComment'}><a href="#" onClick={this.handleDeleteClick}>Delete Comment</a></li>);
    }

    if (commentActions.length > 0) {
      return (
        <div className={styles.optionsMenu}>
          <div className="btn-group">
            <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={_this.handleScroll}>
              <i className={styles.gearIcon}></i>
            </a>
            <ul ref="gearDropDown" className="dropdown-menu dropdown-menu-right">
              {commentActions}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  renderEditComment = (body) => {
    return (<div className={styles.contentContainer}>
        <div className="form-horizontal">
          <div className="form-group" style={{ marginBottom: '5px' }}>

            <div className="col-xs-12">
              <SizungInputApp ref="input" className="form-control" onSubmit={this.handleSubmit} onChange={this.handleChange} rows="3" defaultValue={body} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '5px' }}>
            <div className="col-xs-12">
              <div className="btn btn-sm btn-success" onClick={this.handleSave} style={{ marginRight: '5px' }}>Save</div>
              <div className="btn btn-sm btn-default" onClick={this.closeEditForm}>Cancel</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderShowComment = () => {
    const { body } = this.props.comment;
    return (<div className={styles.contentContainer}>
        {this.renderCommentSettingsOptions()}
        <div className={styles.commentBody} ref="commentBody">
          <TextWithMentions>{body}</TextWithMentions>
        </div>
          {this.lastUpdatedTime()}
      </div>
    );
  };

  render() {
    const { author, body } = this.props.comment;
    return (
      <div className={styles.root}>
        <div className={styles.userContainer}>
          { this.props.showAuthor ? <User user={author}/> : ''}
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
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentUser: PropTypes.object.isRequired,
  handleCommentSettingsDropdownScroll: PropTypes.func.isRequired,
  showAuthor: PropTypes.bool.isRequired,
};

Comment.defaultProps = {
  showAuthor: true,
};


export default Comment;
