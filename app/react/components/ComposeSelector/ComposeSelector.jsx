import React, { PropTypes } from 'react';
import ChatIcon from '../ChatIcon';
import AgendaItemIcon from '../AgendaItemIcon';
import DeliverableIcon from '../DeliverableIcon';
import styles from './ComposeSelector.css';

class ComposeSelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    canCreateAgendaItem: PropTypes.bool.isRequired,
    canCreateDeliverable: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    canCreateAgendaItem: false,
    canCreateDeliverable: false,
  }

  constructor() {
    super();
    this.state = { open: false, selectedType: 'comment' };
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  renderChat = () => {
    return <div className={styles.option}><ChatIcon />Chat</div>;
  }

  renderAgendaItem = () => {
    return <div className={styles.option}><AgendaItemIcon />Agenda</div>;
  }

  renderDeliverable = () => {
    return <div className={styles.option}><DeliverableIcon />Delivera</div>;
  }

  renderClosed = () => {
    return (
      <div className={styles.rootClosed} onClick={this.handleOpen}>
        {this.renderChat()}
        <div className={styles.caretLeft}></div>
      </div>
    );
  };

  renderOpen = () => {
    return (
      <div className={styles.rootOpen}>
        {this.renderChat()}
        {this.props.canCreateAgendaItem ? this.renderAgendaItem() : null}
        {this.props.canCreateDeliverable ? this.renderDeliverable() : null}
        <div className={styles.caretRight} onClick={this.handleClose}></div>
      </div>
    );
  }

  render() {
    return this.state.open ? this.renderOpen() : this.renderClosed();
  }
}

export default ComposeSelector;
