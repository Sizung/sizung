import React, { PropTypes } from 'react';
import SizungTime from '../SizungTime';
import UserApp from '../../containers/UserApp';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions';
import OptionsDropdown from '../OptionsDropdown/index';
import ComposerApp from '../../containers/ComposerApp';
import { toMarkdown } from '../../utils/markdownUtils';

class Comment extends React.Component {
  constructor() {
    super();

    this.state = {
      edit: false,
    };

    this.dropDownOptions = [{
      label: 'Edit Comment',
      function: this.openEditForm,
    }, {
      label: 'Delete Comment',
      function: this.handleDeleteClick,
    }];
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

  onEditorContentChange = (editorContentState) => {
    this.editorContentState = editorContentState;
  };

  onCommentSave = () => {
    this.handleSubmit(toMarkdown(this.editorContentState));
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
      {editedIndicator}<SizungTime value={lastUpdatedAt} />
    </div>);
  };

  renderCommentSettingsOptions = () => {
    const { comment, currentUser } = this.props;
    const { authorId } = comment;

    if (currentUser.id === authorId) {
      return (
        <div className={styles.optionsMenu}>
          <OptionsDropdown options={this.dropDownOptions} />
        </div>
      );
    }
  }

  renderEditComment = (body) => {
    return (<div className={styles.contentContainer}>
        <div className="form-horizontal">
          <div className="form-group" style={{ marginBottom: '5px' }}>
            <div className="col-xs-12">
              <ComposerApp
                ref="input"
                className="form-control"
                onSubmit={this.handleSubmit}
                value={body}
                onChange={this.onEditorContentChange}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '5px' }}>
            <div className="col-xs-12">
              <div className="btn btn-sm btn-success" onClick={this.onCommentSave} style={{ marginRight: '5px' }}>Save</div>
              <div className="btn btn-sm btn-default" onClick={this.closeEditForm}>Cancel</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderShowComment = () => {
    const { body } = this.props.comment;
    return (
      <div className={styles.contentContainer}>
        {this.renderCommentSettingsOptions()}
        <div className={styles.commentBody} ref="commentBody">
          <TextWithMentions>{body}</TextWithMentions>
        </div>
        {this.props.showTimeStamp ? this.lastUpdatedTime() : null}
      </div>
    );
  };

  render() {
    const { author, body } = this.props.comment;
    return (
      <div className={styles.root}>
        <div className={styles.userContainer}>
          { this.props.showAuthor ? <UserApp user={author} /> : ''}
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
    author: PropTypes.object,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentUser: PropTypes.object.isRequired,
  showAuthor: PropTypes.bool.isRequired,
  showTimeStamp: PropTypes.bool.isRequired,
};

Comment.defaultProps = {
  showAuthor: true,
  showTimeStamp: true,
};


export default Comment;
