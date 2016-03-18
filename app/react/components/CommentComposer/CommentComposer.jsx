import React, { PropTypes } from 'react';
import styles from './CommentComposer.css';
import PlusIcon from '../PlusIcon';
import SizungInputApp from '../../containers/SizungInputApp';
import ComposeSelector from '../ComposeSelector/ComposeSelector';

class CommentComposer extends React.Component {
  static propTypes = {
    createComment: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    canCreateAgendaItem: PropTypes.bool.isRequired,
    canCreateDeliverable: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      value: '',
    };

    this.handleSubmit = (e) => {
      const name = this.state.value.trim();
      if (name === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
      this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      this.setState({ value: '' });
    };
  }

  handleSelect = (selectedType) => {
    this.props.onSelect(selectedType);
  }

  handleChangeInMentionBox = (ev, value) => {
    this.setState({ value });
  };

  render() {
    const { canCreateAgendaItem, canCreateDeliverable } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.user}>
          <PlusIcon size={'small'}/>
        </div>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Write your comment here" />
        </form>
        <div className={styles.chatButtons}>
          <ComposeSelector canCreateAgendaItem={canCreateAgendaItem} canCreateDeliverable={canCreateDeliverable} onSelect={this.handleSelect} />
        </div>
      </div>
    );
  }
}

export default CommentComposer;
