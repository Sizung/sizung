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
    scrollListToBottom: PropTypes.func,
    entityId: PropTypes.string,
    conversations: PropTypes.object,
    mode: PropTypes.string.isRequired,
    setComposerState: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue ? props.defaultValue : '',
      composerType: 'comment',
      newObjects: 0,
    };
  }

  componentWillReceiveProps(props) {
    if (props.mode === 'ship') {
      this.setState({ value: props.defaultValue });
    } else if (props.mode !== 'ship' && this.props.mode === 'ship') {
      this.setState({ value: '' });
    }
  }

  handleSelect = (composerType, value) => {
    this.setState({ composerType, value });
  };

  handleClose = () => {
    this.setState({ composerType: 'comment' });
  };

  setValue = (value) => {
    this.setState({ value });
  };

  renderComposer(composerType) {
    const { currentUser, parent, createComment, createAgendaItem, createDeliverable, createAttachment, entityId, labels } = this.props;
    console.log('defaultValue: ' + this.props.defaultValue);
    switch (composerType) {
      case 'agendaItem':
        return <AgendaItemComposer parent={parent}
                                   createAgendaItem={createAgendaItem}
                                   onClose={this.handleClose}
                                   defaultValue={this.props.mode === 'ship' ? this.props.defaultValue : this.state.value}
                                   createAttachment={createAttachment}
                                   setComposerValue={this.setValue}
                                   labels={labels}
                                   conversations={this.props.conversations}
                                   mode={this.props.mode}
               />;
      case 'deliverable':
        return <DeliverableComposer parent={parent}
                                    createDeliverable={createDeliverable}
                                    onClose={this.handleClose}
                                    currentUser={currentUser}
                                    defaultValue={this.props.mode === 'ship' ? this.props.defaultValue : this.state.value}
                                    createAttachment={createAttachment}
                                    setComposerValue={this.setValue}
                                    labels={labels}
                                    conversations={this.props.conversations}
                                    mode={this.props.mode}
               />;
      case 'comment':
      default:
        return <CommentComposer parent={parent}
                                entityId={entityId}
                                createComment={createComment}
                                onSelect={this.handleSelect}
                                currentUser={currentUser}
                                createAttachment={createAttachment}
                                scrollListToBottom={this.props.scrollListToBottom}
                                labels={labels}
                                defaultValue={this.props.mode === 'ship' ? this.props.defaultValue : this.state.value}
                                mode={this.props.mode}
                                setComposerState={this.props.setComposerState}
                                resetComposerState={this.props.resetComposerState}
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
    console.log('Compose Container value: ' + this.state.value + ', mode: ' + this.props.mode);
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
