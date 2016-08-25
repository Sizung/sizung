import React, { PropTypes } from 'react';
import styles from './AgendaItemComposer.css';
import CloseIcon from '../CloseIcon';
import Icon from '../Icon';
import * as deliverableUtils from '../../utils/deliverableUtils';
import SizungInput from '../SizungInput';
import ConversationsDropdownApp from '../../containers/ConversationsDropdownApp';

class AgendaItemComposer extends React.Component {
  static propTypes = {
    createAgendaItem: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      conversationId: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
    setComposerValue: PropTypes.func,
    labels: PropTypes.object.isRequired,
    conversations: PropTypes.object,
  };

  static defaultProps = {
    defaultValue: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue.substring(0, 40),
      parent: props.parent,
    };
  }

  _setInputRef = (input) => {
    if (input) {
      this.inputRef = input;
      input.focus();
    }
  }

  handleSubmit = () => {
    const { parent } = this.state;
    const title = this.state.value.trim();
    const conversationId = deliverableUtils.getConversationIdFrom(parent);

    if (title === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
    //if (!id) {
      this.props.createAgendaItem({ conversation_id: conversationId, title, source_timeline: this.props.parent });
    //} else {
    //  this.props.createAgendaItem({ conversation_id: id, title });
    //}
    this.setState({ value: '' });
    this.props.setComposerValue('');
    this.props.onClose();
  };

  handleKeyDown = (e) => {
    e.stopPropagation();
    //if (e.keyCode ===   13 && !e.shiftKey) {
    //  e.preventDefault();
    //  this.handleSubmit();
    //}
  };

  handleChangeInInput = (ev) => {
    const { value } = ev.target;
    this.setState({ value });
  };

  handleTeamChange = (id) => {
    this.setState({ parent: {
      id,
      type: 'conversations',
      conversationId: id,
    } });
  };

  render() {
    const { value } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            { this.props.labels.agendaItemLabel }
          </div>
          <div className={styles.filler}></div>
          <CloseIcon type="transparent" style={{ marginBottom: '0' }} onClick={this.props.onClose} />
        </div>
        <div className={styles.inputRow}>
          <Icon type="agendaItem" className={styles.agendaItemIcon} />
          <SizungInput
            inputRef={this._setInputRef}
            maxLength={40}
            onSubmit={this.handleSubmit}
            className={styles.agendaInput}
            onChange={this.handleChangeInInput}
            onKeyDown={this.handleKeyDown}
            value={this.state.value}
            placeholder={ this.props.labels.agendaItemInputPlaceholder }
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
            <ConversationsDropdownApp conversationId={deliverableUtils.getConversationIdFrom(this.state.parent)} onUpdate={this.handleTeamChange} direction={'north'} conversations={this.props.conversations}/>
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

export default AgendaItemComposer;
