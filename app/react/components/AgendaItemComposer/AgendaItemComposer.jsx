import React, { PropTypes } from 'react';
import styles from './AgendaItemComposer.css';
import SizungInputApp from '../../containers/SizungInputApp';
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

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this.refs.name);
    ui.setCursorToEnd($(el).find('textarea')[0]);
  }
  
  handleSubmit = (e) => {
    const { parent } = this.props;
    const title = this.state.value.trim();
    let conversationId = deliverableUtils.getConversationIdFrom(parent);

    if (title === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
    this.props.createAgendaItem({ conversation_id: conversationId, title });
    this.setState({ value: '' });
    this.props.onClose();
  };

  handleChangeInMentionBox = (ev, value) => {
    this.setState({ value });
  };

  charCounterStyle = () => {
    return (40 - this.state.value.length) < 5 ? styles.charsHintRed : styles.charsHint;
  }
  
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.row}>
          <div className={styles.composeHeader}>
            TO DISCUSS
          </div>
          <div className={styles.filler}></div>
          <CloseIcon type="transparent" style={{ marginBottom: '0' }} onClick={this.props.onClose} />
        </div>
        <div className={styles.formRow}>
          <Icon type="agendaItem" className={styles.agendaItemIcon} />
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} maxLength={ 40 } rows="1" placeholder="What would you like to discuss?" />
          </form>
          <div className={this.charCounterStyle()}>{40 - this.state.value.length} chars</div>
        </div>
      </div>
    );
  }
}

export default AgendaItemComposer;
