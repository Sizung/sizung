import React, { PropTypes } from 'react';
import styles from './BottomNavigationBar.css';
import Icon from '../Icon';

class BottomNavigationBar extends React.Component {

  static propTypes = {
    selectedOption: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleClick = (option) => {
    this.props.onChange(option);
  };

  render() {
    const { selectedOption } = this.props;
    return (
      <div className={styles.root}>
        <div className={ selectedOption === 'agendaItems' ? styles.optionSelected : styles.option } onClick={this.handleClick.bind(this, 'agendaItems')}>
          <Icon type="agendaItem" className={styles.optionIcon}/>
          <div className={styles.optionLabel}>
            To Discuss
          </div>
        </div>
        <div className={ selectedOption === 'conversations' ? styles.optionSelected : styles.option } onClick={this.handleClick.bind(this, 'conversations')}>
          <Icon type="chat" className={styles.optionIcon}/>
          <div className={styles.optionLabel}>
            Teams
          </div>
        </div>
        <div className={ selectedOption === 'deliverables' ? styles.optionSelected : styles.option } onClick={this.handleClick.bind(this, 'deliverables')}>
          <Icon type="deliverable" className={styles.optionIcon}/>
          <div className={styles.optionLabel}>
            To Do
          </div>
        </div>
      </div>
    );
  }
}

export default BottomNavigationBar;
