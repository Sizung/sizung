import React, { PropTypes } from 'react';
import styles from './ComposeSelector.css';
import Icon from '../Icon';

class ComposeSelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
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
    return <div className={styles.option} onClick={this.handleClose}><Icon type="chat" className={styles.icon} contentClassName={styles.chat}>Chat</Icon></div>;
  }

  renderAgendaItem = () => {
    return <div className={styles.option} onClick={this.selectAgendaItem}><Icon type="agendaItem" className={styles.icon}>To Discuss</Icon></div>;
  }

  renderDeliverable = () => {
    return <div className={styles.option} onClick={this.selectDeliverable}><Icon type="deliverable" className={styles.icon}>To Do</Icon></div>;
  }

  renderCaret = (type) => {
    if (type === 'right') {
      return <div className={styles.caretRight} onClick={this.handleClose}></div>;
    }

    return <div className={styles.caretLeft}></div>;
  }

  renderClosed = () => {
    return (
      <div className={styles.root} onClick={this.handleOpen}>
        <div className={styles.separator}></div>
        {this.renderChat()}
        {this.renderCaret('left')}
      </div>
    );
  };

  renderOpen = () => {
    return (
      <div className={styles.rootOpen}>
        {this.renderChat()}
        {this.renderAgendaItem()}
        {this.renderDeliverable()}
        {this.renderCaret('right')}
      </div>
    );
  }

  render() {
    return this.state.open ? this.renderOpen() : this.renderClosed();
  }
}

export default ComposeSelector;
