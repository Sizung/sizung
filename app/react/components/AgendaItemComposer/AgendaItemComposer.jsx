import React, { PropTypes } from 'react';
import styles from './AgendaItemComposer.css';
import SizungInputApp from '../../containers/SizungInputApp';
import CloseIcon from '../CloseIcon';
import AgendaItemIcon from '../AgendaItemIcon';

class AgendaItemComposer extends React.Component {
  static propTypes = {
    createAgendaItem: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { value: '' };
  }

  handleSubmit = (e) => {
    const title = this.state.value.trim();
    const conversationId = this.props.parent.id;

    if (title === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
    this.props.createAgendaItem({ conversation_id: conversationId, title });
    this.setState({ value: '' });
    this.props.onClose();
  };

  handleChangeInMentionBox = (ev, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            NEW AGENDA
          </div>
          <div className={styles.filler}></div>
          <CloseIcon type="transparent" style={{ marginBottom: '0' }} onClick={this.props.onClose} />
        </div>
        <div className={styles.row}>
          <AgendaItemIcon size="xLarge" />
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Type your agenda item here" />
          </form>
        </div>
      </div>
    );
  }
}

export default AgendaItemComposer;
