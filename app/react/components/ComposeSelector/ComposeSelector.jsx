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
    this.state = { open: false };
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  selectAgendaItem = () => {
    this.props.onSelect('agendaItem');
  }

  selectDeliverable = () => {
    this.props.onSelect('deliverable');
  }

  renderChat = () => {
    return <div className={styles.option} onClick={this.handleClose}><ChatIcon style={{ marginRight: '10px' }} />Chat</div>;
  }

  renderAgendaItem = () => {
    return <div className={styles.option} onClick={this.selectAgendaItem}><AgendaItemIcon size="large" style={{ marginRight: '10px' }} />Agenda</div>;
  }

  renderDeliverable = () => {
    return <div className={styles.option} onClick={this.selectDeliverable}><DeliverableIcon size="large" inverted style={{ marginRight: '10px' }} />Deliverable</div>;
  }

  renderClosed = () => {
    return (
      <div className={styles.root} onClick={this.handleOpen}>
        {this.renderChat()}
        <div>
          <div className={styles.caretLeft}></div>
        </div>
      </div>
    );
  };

  renderOpen = () => {
    return (
      <div className={styles.root}>
        {this.renderChat()}
        {this.props.canCreateAgendaItem ? this.renderAgendaItem() : null}
        {this.props.canCreateDeliverable ? this.renderDeliverable() : null}
        <div onClick={this.handleClose}>
          <div className={styles.caretRight}></div>
        </div>
      </div>
    );
  }

  render() {
    return this.state.open ? this.renderOpen() : this.renderClosed();
  }
}

export default ComposeSelector;
