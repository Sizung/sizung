import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import styles from './DeliverableComposer.css';
import SizungInputApp from '../../containers/SizungInputApp';
import CloseIcon from '../CloseIcon';
import Icon from '../Icon';
import EditableUserApp from '../../containers/EditableUserApp';
import EditableDate from '../EditableDate';
import * as deliverableUtils from '../../utils/deliverableUtils.js';
import * as ui from '../../utils/ui';

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
    defaultValue: PropTypes.string,
  };

  static defaultProps = {
    defaultValue: '',
  }

  constructor(props) {
    super(props);
    this.state = { value: props.defaultValue.substring(0, 40), assigneeId: null, dueOn: null };
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

  handleSubmit = () => {
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

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  handleChangeInMentionBox = (ev) => {
    const { value } = ev.target;
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

  handleKeyDownOnDueDate = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  };

  render() {
    const { dueOn } = this.state;
    const assigneeId = this.assigneeId();
    const { parent } = this.props;
    const { value } = this.state;

    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            ACTION
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
            <div className={styles.dueOnWrapper} onKeyDown={this.handleKeyDownOnDueDate}>
              <EditableDate value={dueOn} onUpdate={this.handleDueOnUpdate} editable />
            </div>
          </div>
        </div>
        <div className={styles.inputRow}>
          <Icon type="deliverable" />
          <textarea
            rows="1"
            ref="name"
            type="text"
            maxLength={ 40 }
            onKeyDown={this.handleKeyDown}
            onSubmit={this.handleSubmit}
            value={this.state.value}
            className={styles.deliverableInput}
            onChange={this.handleChangeInMentionBox}
            placeholder="What needs to be done?"
          />
          <div
            className={(value && (40 - value.length)) < 5 ? styles.charsHintRed : styles.charsHint}
          >
            {40 - ((value && value.length) || 0)} chars
          </div>
        </div>

      </div>
    );
  }
}

export default DeliverableComposer;
