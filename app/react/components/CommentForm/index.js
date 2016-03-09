import React, { PropTypes } from 'react';
import styles from './index.css';
import PlusIcon from '../PlusIcon';
import SizungInputApp from '../../containers/SizungInputApp';
import ComposeSelector from '../ComposeSelector/ComposeSelector';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      height: 40,
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

    this.handleKeyDown = (e) => {
      if (e.keyCode === 9 && !e.shiftKey) {
        e.preventDefault();
        const nextActionInFocusIndex = ((this.commentActions.indexOf(this.state.commentActionInFocus) + 1) % this.commentActions.length);
        this.setState({ commentActionInFocus: this.commentActions[nextActionInFocusIndex] });
      }
      e.target.style.height = 0;
      e.target.style.height = e.target.scrollHeight + 'px';
      this.props.onResize(Number.parseInt(e.target.style.height.replace('px', ''), 10));
    };

    this.handleKeyUp = (e) => {
      e.target.style.height = 0;
      e.target.style.height = e.target.scrollHeight + 'px';
      this.props.onResize(Number.parseInt(e.target.style.height.replace('px', ''), 10));
    };
  }

  componentWillUpdate() {
    if (this.props.canCreateAgendaItem) {
      this.commentActions = ['comment', 'agendaItem'];
    } else if (this.props.canCreateDeliverable) {
      this.commentActions = ['comment', 'deliverable'];
    } else {
      this.commentActions = ['comment'];
    }
  }

  render() {
    const { canCreateAgendaItem, canCreateDeliverable } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.user}>
          <PlusIcon />
        </div>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onSubmit={this.handleSubmit} value={this.state.value} onResize={this.handleOnResize} rows="1" placeholder="Type your comment here" />
        </form>
        <div className={styles.chatButtons}>
          <ComposeSelector canCreateAgendaItem={canCreateAgendaItem} canCreateDeliverable={canCreateDeliverable} onUpdate={(selectedType) => { console.log(selectedType); }} />
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
