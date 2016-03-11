import React, { PropTypes } from 'react';
import styles from './DeliverableComposer.css';
import SizungInputApp from '../../containers/SizungInputApp';
import CloseIcon from '../CloseIcon';
import DeliverableIcon from '../DeliverableIcon';
import EditableUserApp from '../../containers/EditableUserApp';
import EditableDate from '../EditableDate';

class DeliverableComposer extends React.Component {
  static propTypes = {
    createDeliverable: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { value: '', assigneeId: null, dueOn: null };
  }

  handleSubmit = (e) => {
    const title = this.state.value.trim();
    const { assigneeId, dueOn } = this.state;
    if (title === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
    this.props.createDeliverable({ agenda_item_id: this.props.parent.id, title, assignee_id: assigneeId, due_on: dueOn });
    this.setState({ value: '' });
  };

  handleChangeInMentionBox = (ev, value) => {
    this.setState({ value });
  };

  handleAssigneeUpdate = (assigneeId) => {
    this.setState({ assigneeId });
  }

  handleDueOnUpdate = (dueOn) => {
    this.setState({ dueOn });
  }

  render() {
    const { dueOn } = this.state;

    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            NEW DELIVERABLE
          </div>
          <div className={styles.filler}></div>
          <CloseIcon onClick={this.props.onClose} />
        </div>
        <div className={styles.properties}>
          <div className={styles.assigneeContainer}>
            <div className={styles.assignLabel}>ASSIGN TO</div>
            <EditableUserApp userId={this.state.assigneeId} conversationId={this.props.parent.conversationId} editable direction="north" onUpdate={this.handleAssigneeUpdate} />
          </div>
          <div className={styles.dueOnContainer}>
            <div className={styles.dueOnLabel}>DUE ON</div>
            <div className={styles.dueOnWrapper}>
              <EditableDate value={dueOn} onUpdate={this.handleDueOnUpdate} editable />
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <DeliverableIcon inverted size="xLarge" />
            <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Type your deliverable here" />
          </form>
        </div>
      </div>
    );
  }
}

export default DeliverableComposer;
