import React, { PropTypes } from 'react';
import styles from './DeliverableComposer.css';
import SizungInputApp from '../../containers/SizungInputApp';
import CloseIcon from '../CloseIcon';
import Icon from '../Icon';
import EditableUserApp from '../../containers/EditableUserApp';
import EditableDate from '../EditableDate';
import * as deliverableUtils from '../../utils/deliverableUtils.js';

class DeliverableComposer extends React.Component {
  static propTypes = {
    createDeliverable: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor() {
    super();
    this.state = { value: '', assigneeId: null, dueOn: null };
  }

  getType = (type) => {
    switch (type) {
      case 'conversations':
        return 'Conversation';
      case 'agendaItems':
        return 'AgendaItem';
      default:
        console.warn(`Type not supported here: ${type}`);
        throw `Type not supported here: ${type}`;
    }
  }

  handleSubmit = (e) => {
    const { parent } = this.props;
    const title = this.state.value.trim();
    const { dueOn } = this.state;
    const assigneeId = this.assigneeId();
    let parentId = null;
    let parentType = null;
    if (parent.type === 'agendaItems' || parent.type === 'conversations') {
      parentId = parent.id;
      parentType = this.getType(parent.type);
    } else if (parent.type === 'deliverables') {
      parentId = parent.parent.id;
      parentType = this.getType(parent.parent.type);
    } else {
      console.warn(`DeliverableComposer does not support parent of type: ${parent.type}`);
      throw `DeliverableComposer does not support parent of type: ${parent.type}`;
    }

    if (title === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
    this.props.createDeliverable({ parent_id: parentId, parent_type: parentType, title, assignee_id: assigneeId, due_on: dueOn });
    this.setState({ value: '', assigneeId: null, dueOn: null });
    this.props.onClose();
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

  assigneeId = () => {
    return this.state.assigneeId || this.props.currentUser.id;
  }

  render() {
    const { dueOn } = this.state;
    const assigneeId = this.assigneeId();
    const { parent } = this.props;
    
    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            NEW DELIVERABLE
          </div>
          <div className={styles.filler}></div>
          <CloseIcon onClick={this.props.onClose} style={{ marginBottom: '0' }} type="transparent" />
        </div>
        <div className={styles.properties}>
          <div className={styles.assigneeContainer}>
            <div className={styles.assignLabel}>ASSIGN TO</div>
            <EditableUserApp userId={assigneeId} conversationId={deliverableUtils.getConversationIdFrom(parent)} editable direction="north" onUpdate={this.handleAssigneeUpdate} />
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
            <Icon type="deliverable" style={{ alignSelf: 'flex-end' }} />
            <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Enter Deliverable Name" />
            <div className={styles.charsHint}>40 chars</div>
          </form>
        </div>
      </div>
    );
  }
}

export default DeliverableComposer;
