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
    createAttachment: PropTypes.func.isRequired,
    newObjects: PropTypes.number,
    handleNewObjectMarkerClick: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      value: '',
      composerType: 'comment',
      newObjects: 0,
    };
  }

  handleSelect = (composerType, value) => {
    this.setState({ composerType, value });
  }

  handleClose = () => {
    this.setState({ composerType: 'comment' });
  }

  renderComposer(composerType) {
    const { currentUser, parent, createComment, createAgendaItem, createDeliverable, createAttachment } = this.props;

    switch (composerType) {
      case 'agendaItem':
        return <AgendaItemComposer parent={parent}
                                   createAgendaItem={createAgendaItem}
                                   onClose={this.handleClose}
                                   defaultValue={this.state.value}
                                   createAttachment={createAttachment}
               />;
      case 'deliverable':
        return <DeliverableComposer parent={parent}
                                    createDeliverable={createDeliverable}
                                    onClose={this.handleClose}
                                    currentUser={currentUser}
                                    defaultValue={this.state.value}
                                    createAttachment={createAttachment}
               />;
      case 'comment':
      default:
        return <CommentComposer parent={parent}
                                createComment={createComment}
                                onSelect={this.handleSelect}
                                currentUser={currentUser}
                                defaultValue={this.state.value}
                                createAttachment={createAttachment}
               />;
    }
  }

  renderNewObjectsMarker = () => {
    const { newObjects } = this.props;
    if (newObjects > 0) {
      return (
          <div className={styles.newObjectsMarkerContainer}>
            <div className={styles.newObjectsMarker} onClick={this.props.handleNewObjectMarkerClick}>
              { newObjects + (newObjects === 1 ? ' New Comment' : ' New Comments') }
              <span className={styles.caret}/>
            </div>
          </div>
      );
    }
    return undefined;
  };

  render() {
    return (
      <div className={styles.wrapper}>
        {this.renderNewObjectsMarker()}
        <div className={styles.root}>
          { this.renderComposer(this.state.composerType) }
        </div>
      </div>
    );
  }
}

export default ComposeContainer;
