import React, { PropTypes } from 'react';
import styles from './AgendaItemComposer.css';
import CloseIcon from '../CloseIcon';
import Icon from '../Icon';
import * as deliverableUtils from '../../utils/deliverableUtils';
import * as ui from '../../utils/ui';

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
  };

  static defaultProps = {
    defaultValue: '',
  }

  constructor(props) {
    super(props);
    this.state = { value: props.defaultValue.substring(0, 40) };
  }

  handleSubmit = () => {
    const { parent } = this.props;
    const title = this.state.value.trim();
    const conversationId = deliverableUtils.getConversationIdFrom(parent);

    if (title === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
    this.props.createAgendaItem({ conversation_id: conversationId, title });
    this.setState({ value: '' });
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

  render() {
    const { value } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            PRIORITY
          </div>
          <div className={styles.filler}></div>
          <CloseIcon type="transparent" style={{ marginBottom: '0' }} onClick={this.props.onClose} />
        </div>
        <div className={styles.inputRow}>
          <Icon type="agendaItem" className={styles.agendaItemIcon} />
          <textarea
            rows="1"
            ref="name"
            type="text"
            maxLength={ 40 }
            onKeyDown={this.handleKeyDown}
            onSubmit={this.handleSubmit}
            value={this.state.value}
            className={styles.agendaInput}
            onChange={this.handleChangeInMentionBox}
            placeholder="What would you like to discuss?"
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

export default AgendaItemComposer;
