import React, { PropTypes } from 'react';
import styles from './index.css';
import CommentComposer from '../CommentComposer/CommentComposer';
import AgendaItemComposer from '../AgendaItemComposer/AgendaItemComposer';
import DeliverableComposer from '../DeliverableComposer/DeliverableComposer';

class ComposeContainer extends React.Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    createComment: PropTypes.func.isRequired,
    createAgendaItem: PropTypes.func.isRequired,
    createDeliverable: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor() {
    super();

    this.state = {
      value: '',
      composerType: 'comment',
    };
  }

  handleSelect = (composerType, value) => {
    this.setState({ composerType, value });
  }

  handleClose = () => {
    this.handleSelect('comment');
  }

  renderComposer(composerType) {
    const { currentUser, parent, createComment, createAgendaItem, createDeliverable } = this.props;

    switch (composerType) {
      case 'agendaItem':
        return <AgendaItemComposer parent={parent}
                                   createAgendaItem={createAgendaItem}
                                   onClose={this.handleClose}
                                   defaultValue={this.state.value}
               />;
      case 'deliverable':
        return <DeliverableComposer parent={parent}
                                    createDeliverable={createDeliverable}
                                    onClose={this.handleClose}
                                    currentUser={currentUser}
                                    defaultValue={this.state.value}
               />;
      case 'comment':
      default:
        return <CommentComposer parent={parent}
                                createComment={createComment}
                                onSelect={this.handleSelect}
               />;
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

export default ComposeContainer;
