import React, { Component, PropTypes } from 'react';
import styles from "./index.css";
import fetch from 'isomorphic-fetch';
import MetaTagsManager from '../../utils/MetaTagsManager';
import { transformAgendaItemFromJsonApi } from '../../utils/jsonApiUtils';
import Immutable from 'immutable';

class EditableAgendaItem extends React.Component {
  constructor() {
    super();
    this.state = { edit: false, filter: '' };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.triggerCancel = this.triggerCancel.bind(this);
  }

  handleEditClick(event) {
    const conversationId = this.props.agendaItem.conversationId;
    return fetch('/api/conversations/' + conversationId + '/agenda_items', {
      method: 'get',
      credentials: 'include', // send cookies with it
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': MetaTagsManager.getCSRFToken(),
      },
    })
        .then(response => response.json())
        .then(json => {
          const agendaItems = new Immutable.List(json.data.map(transformAgendaItemFromJsonApi));
          const sortedAgendaItems = agendaItems.sortBy((agendaItem) => {
            return agendaItem.createdAt;
          });
          this.setState({ edit: true, agendaItems: sortedAgendaItems });
        });
  }

  renderShow(selectedOption, editable) {
    return <span className={styles['current-title' + (editable ? '-editable' : '') + (this.props.inverted ? '-inverted' : '')] } title={selectedOption.title} onClick={editable ? this.handleEditClick : null}>{this.displayOption(selectedOption)}</span>;
  }


  handleChange(event) {
    this.triggerUpdate(event.value);
  }

  triggerUpdate(id) {
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
    if (event.key === 'Enter') {
      this.handleInputSubmit();
    }
    else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  handleOptionClick(id) {
    this.triggerUpdate(id);
  }

  handleInputSubmit() {
    const { filter, agendaItems } = this.state;
    const filteredOptions = this.filteredOptions(filter, agendaItems);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  displayOption(option) {
    return option.title;
  }


  filteredOptions(filter, options) {
    return options.filter(function (option) {
      return option.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });
  }

  selectedMarker(selectedOption, option) {
    if (selectedOption.id === option.id) {
      return <i className="fa fa-check pull-right" style={{ color: 'green', padding: '5px' }}></i>;
    }
  }

  renderEdit(selectedOption, options) {
    const optionElementList = this.filteredOptions(this.state.filter, options).map((option) => {
      return (
        <div className={styles['agenda-item-row']} onClick={() => this.handleOptionClick(option.id)} key={option.id}>
          <span className={styles['agenda-item-column']}>{this.displayOption(option)}</span>
          <span className={styles['marker-column']}>{this.selectedMarker(selectedOption, option)}</span>
        </div>
      );
    });

    return (
      <div className={styles.root}>
        <div className={styles.title}>
          Agenda Items
          <i className={styles["close-icon"]} onClick={this.triggerCancel}></i>
        </div>
        <input className={styles.input} ref="filterInput" type="text" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange} placeholder="Search Agenda Items"/>
        <div>
          {optionElementList}
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.edit && !prevState.edit) {
      var inputElem = this.refs.filterInput;
      inputElem.focus();
    }
  }

  render() {
    const { agendaItem, editable } = this.props;
    if (this.state.edit) {
      const agendaItems = this.state.agendaItems;
      return (
        <div className={styles['root-container']}>
          {this.renderShow(agendaItem, editable)}
          {this.renderEdit(agendaItem, agendaItems)}
        </div>
      );
    } else {
      return this.renderShow(agendaItem, editable);
    }
  }
}

EditableAgendaItem.propTypes = {
  editable: PropTypes.bool,
  agendaItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    conversationId: PropTypes.string.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  inverted: PropTypes.bool,
};

EditableAgendaItem.defaultProps = {
  editable: true,
};

export default EditableAgendaItem;
