import React, { Component, PropTypes } from 'react';
import AgendaItem from './AgendaItem';
import { Glyphicon } from 'react-bootstrap';


class AgendaItemList extends Component {
  render() {
    const { agendaItems, selectAgendaItem, selectedId } = this.props;

    return (
      <div className='agendaItemList'>
        <div className='row agendaItemListHeader padding-sm box-shadow'>
          <i className="fa fa-tag"></i>  {" "}<strong>Agenda</strong>
        </div>
        {
          agendaItems.map(function(agendaItem) {
            return(<AgendaItem
                    key={agendaItem.id}
                    agendaItem={agendaItem}
                    selectAgendaItem={selectAgendaItem}
                    selected={agendaItem.id === selectedId}
                />);
          })
        }
      </div>
    );
  }
}

AgendaItemList.propTypes = {
  agendaItems: PropTypes.object.isRequired,
  selectAgendaItem: PropTypes.func.isRequired
};

export default AgendaItemList;
