import React, { PropTypes } from 'react';
import styles from './DeliverableComposer.css';
import CloseIcon from '../CloseIcon';
import Icon from '../Icon';
import EditableUserApp from '../../containers/EditableUserApp';
import EditableDate from '../EditableDate';
import * as deliverableUtils from '../../utils/deliverableUtils.js';
import SizungInput from '../SizungInput';
import ConversationsDropdownApp from '../../containers/ConversationsDropdownApp';

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
    setComposerValue: PropTypes.func,
    labels: PropTypes.object.isRequired,
  };

  static defaultProps = {
    defaultValue: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue.substring(0, 40),
      assigneeId: null,
      dueOn: null,
      parent: props.parent,
    };
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
    const { parent } = this.state;
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
    this.props.createDeliverable({ parent_id: parentId, parent_type: parentType, title, assignee_id: assigneeId, due_on: dueOn, source_timeline: this.props.parent });
    this.setState({ value: '', assigneeId: null, dueOn: null });
    this.props.setComposerValue('');
    this.props.onClose();
  };

  handleKeyDown = (e) => {
    console.log('into handle key down')
    e.stopPropagation();
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  handleChangeInInput = (ev) => {
    const { value } = ev.target;
    this.setState({ value });
  };

  handleAssigneeUpdate = (assigneeId) => {
    this.setState({ assigneeId });
  };

  handleDueOnUpdate = (dueOn) => {
    this.setState({ dueOn });
  };

  assigneeId = () => {
    return this.state.assigneeId || this.props.currentUser.id;
  };

  handleKeyDownOnDueDate = (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  };

  handleTeamChange = (id) => {
    this.setState({ parent: {
      id,
      type: 'conversations',
    } });
  };

  _setInputRef = (input) => {
    if (input) {
      this.inputRef = input;
      input.focus();
    }
  };

  render() {
    const { dueOn } = this.state;
    const assigneeId = this.assigneeId();
    const { labels } = this.props;
    const { value, parent } = this.state;

    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            { labels.deliverableLabel }
          </div>
          <div className={styles.filler}></div>
          <CloseIcon onClick={this.props.onClose} style={{ marginBottom: '0' }} type="transparent" />
        </div>
        <div className={styles.properties}>
          <div className={styles.assigneeContainer} onKeyDown={this.handleKeyDown} tabIndex="0">
            <div className={styles.assignLabel}>ASSIGN TO</div>
            <EditableUserApp userId={assigneeId} conversationId={deliverableUtils.getConversationIdFrom(this.state.parent)} editable direction="north" onUpdate={this.handleAssigneeUpdate} />
          </div>
          <div className={styles.dueOnContainer}>
            <div className={styles.dueOnLabel}>DUE ON</div>
            <div className={styles.dueOnWrapper} onKeyDown={this.handleKeyDownOnDueDate}>
              <EditableDate value={dueOn} onUpdate={this.handleDueOnUpdate} editable />
            </div>
          </div>
        </div>
        <div className={styles.inputRow}>
          <Icon type="deliverable" gap="1.5rem"/>
          <SizungInput
            maxLength={40}
            value={this.state.value}
            inputRef={this._setInputRef}
            onSubmit={this.handleSubmit}
            className={styles.deliverableInput}
            onChange={this.handleChangeInInput}
            onKeyDown={this.handleKeyDown}
            placeholder={ labels.deliverableInputPlaceholder }
          />
          <div
            className={(value && (40 - value.length)) < 5 ? styles.charsHintRed : styles.charsHint}
          >
            {40 - ((value && value.length) || 0) + ' chars'}
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.conversationLabel}>
            {'TEAM :'}
          </div>
          <div className={styles.conversationDropdownContainer}>
            <ConversationsDropdownApp conversationId={deliverableUtils.getConversationIdFromParent(this.state.parent)} onUpdate={this.handleTeamChange} direction={'north'} conversations={this.props.conversations}/>
          </div>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.cancelButton} onClick={this.props.onClose}>
            CANCEL
          </div>
          <div className={styles.actionButton} onClick={this.handleSubmit}>
            CREATE
          </div>
        </div>
      </div>
    );
  }
}

export default DeliverableComposer;
