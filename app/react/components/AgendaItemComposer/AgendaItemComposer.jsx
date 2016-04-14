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
    this.state = { value: props.defaultValue };
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
        <div className={styles.formRow}>
          <Icon type="agendaItem" className={styles.agendaItemIcon} />
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Enter Agenda Name" />
          </form>
          <div className={styles.charsHint}>40 chars</div>
        </div>
      </div>
    );
  }
}

export default AgendaItemComposer;
