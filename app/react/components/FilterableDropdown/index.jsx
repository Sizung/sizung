import React, { PropTypes } from 'react';
import styles from './index.css';

class FilterableDropdown extends React.Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      filter: '',
    };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.triggerCancel = this.triggerCancel.bind(this);
  }

  handleEditClick(event) {
    this.setState({ edit: true });
  }

  handleChange(event) {
    this.triggerUpdate(event.value);
  }

  triggerUpdate(id) {
    console.log('Trigger Update with id: ' + id);
    this.props.onUpdate(id);
    this.setState({ edit: false, filter: '' });
  }

  triggerCancel() {
    this.setState({ edit: false, filter: '' });
  }

  handleFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  handleKeyDown(event) {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.handleInputSubmit();
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  handleUserClick(id) {
    this.triggerUpdate(id);
  }

  handleInputSubmit() {
    const { filter } = this.state;
    const filteredOptions = this.filteredOptions(filter, this.props.items);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  renderShow(selectedItem, editable) {
    return <div className={styles['current-item' + (editable ? '-editable' : '')]} onClick={editable ? this.handleEditClick : null}>{ selectedItem ? selectedItem.title : 'Click to Choose'}</div>;
  }

  filteredOptions(filter, options) {
    return options.filter(function (item) {
      const title = (item.title).toLowerCase();
      return title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });
  }

  selectedMarker(selectedItem, item) {
    if (selectedItem && selectedItem.id === item.id) {
      return <i className={styles.check}></i>;
    }
    return undefined;
  }

  dropdownLabel = () => {
    switch (this.props.type) {
      case 'Conversation':
        return 'Conversations';

      case 'AgendaItem':
        return 'Agenda Items';

      default:
        return null;
    }
  };

  renderEdit(selectedItem, items) {
    const { direction } = this.props;
    const options = this.filteredOptions(this.state.filter, items).sortBy((item) => {
      return item.title.toLowerCase();
    }).map((item) => {
      return (
        <div className={styles['item-row']} onClick={() => this.handleUserClick(item.id)} key={item.id}>
            <span className={styles['item-column']}>{item.title}</span>
            <span className={styles['marker-column']}>{this.selectedMarker(selectedItem, item)}</span>
        </div>
      );
    });

    return (
      <div className={[styles['root'], styles[direction + 'Direction']].join(' ')}>
        <div className={styles.title}>
          {this.dropdownLabel()}
          <i className={styles["close-icon"]} onClick={this.triggerCancel}></i>
        </div>
        <input className={styles.input} ref="filterInput" type="text" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange} placeholder={'Search ' + this.dropdownLabel()}/>
        <div>
          {options}
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.edit && !prevState.edit) {
      const inputElem = this.refs.filterInput;
      inputElem.focus();
    }
  }

  render() {
    const { item, items, editable } = this.props;
    if (this.state.edit) {
      return (
        <div className={styles['root-container']}>
          {this.renderShow(item, editable)}
          {this.renderEdit(item, items)}
        </div>
      );
    }
    return this.renderShow(item, editable);
  }
}

FilterableDropdown.propTypes = {
  type: PropTypes.string.isRequired, // AgendaItem or Deliverable
  conversationId: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  items: PropTypes.object,
  item: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  direction: PropTypes.string,
};

FilterableDropdown.defaultProps = {
  editable: true,
  direction: 'south', // possible values: south, north
};

export default FilterableDropdown;
