import React, { PropTypes } from 'react';
import styles from './index.css';
import CommentComposer from '../CommentComposer/CommentComposer';
import AgendaItemComposer from '../AgendaItemComposer/AgendaItemComposer';
import DeliverableComposer from '../DeliverableComposer/DeliverableComposer';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      composerType: 'comment',
    };

    this.commentActions = ['comment'];
    this.handleSubmit = (e) => {
      const name = this.state.value.trim();
      if (this.state.commentActionInFocus === 'comment') {
        if (name === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
        this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      } else if (this.state.commentActionInFocus === 'agendaItem') {
        this.handleAgendaItem(e);
      } else if (this.state.commentActionInFocus === 'deliverable') {
        this.handleDeliverable(e);
      }

      this.setState({ value: '' });
    };

    this.handleAgendaItem = (e) => {
      if (e) {
        e.preventDefault();
      }
      const name = this.state.value.trim();
      if (name === '') { return; }
      this.props.createAgendaItem({ conversation_id: this.props.parent.id, title: name });
      this.setState({ commentActionInFocus: 'agendaItem', value: '' });
    };

    this.handleDeliverable = (e) => {
      if (e) {
        e.preventDefault();
      }
      const name = this.state.value.trim();
      if (name === '') { return; }
      this.props.createDeliverable({ agenda_item_id: this.props.parent.id, title: name });
      this.setState({ commentActionInFocus: 'deliverable', value: '' });
    };
  }

  handleSelect = (selectedType) => {
    this.setState({ composerType: selectedType });
  }

  handleClose = () => {
    this.handleSelect('comment');
  }

  renderComposer(composerType) {
    const { parent, canCreateAgendaItem, canCreateDeliverable, createComment, createAgendaItem, createDeliverable } = this.props;

    switch (composerType) {
      case 'agendaItem':
        return <AgendaItemComposer parent={parent} createAgendaItem={createAgendaItem} onClose={this.handleClose} />;
      case 'deliverable':
        return <DeliverableComposer parent={parent} createDeliverable={createDeliverable} onClose={this.handleClose} />;
      case 'comment':
      default:
        return <CommentComposer parent={parent} createComment={createComment} canCreateAgendaItem={canCreateAgendaItem} canCreateDeliverable={canCreateDeliverable} onSelect={this.handleSelect} />;
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.root}>
          { this.renderComposer(this.state.composerType) }
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func,
  createDeliverable: PropTypes.func,
  parent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  canCreateAgendaItem: PropTypes.bool.isRequired,
  canCreateDeliverable: PropTypes.bool.isRequired,
  onResize: PropTypes.func,
};

export default CommentForm;
