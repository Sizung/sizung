import React, { PropTypes } from 'react';
import styles from './index.css';
import PlusIcon from '../PlusIcon';
import SizungInputApp from '../../containers/SizungInputApp';
import ComposeSelector from '../ComposeSelector/ComposeSelector';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      commentActionInFocus: 'comment', // Possible actions: comment, agendaItem, deliverable
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

    this.handleChangeInMentionBox = (ev, value) => {
      this.setState({
        value,
      });
    };
  }

  render() {
    const { canCreateAgendaItem, canCreateDeliverable } = this.props;

    return (
      <div className={styles.wrapper}>
      <div className={styles.root}>
      <div className={styles.user}>
      <PlusIcon />
      </div>
      <form className={styles.form} onSubmit={this.handleSubmit}>
      <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Type your comment here" />
      </form>
      <div className={styles.chatButtons}>
      <ComposeSelector canCreateAgendaItem={canCreateAgendaItem} canCreateDeliverable={canCreateDeliverable} onUpdate={(selectedType) => { console.log(selectedType); }} />
      </div>
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
