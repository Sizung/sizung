import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItemList extends Component {
  render() {
    const { agendaItems, selectAgendaItem, selectedId, updateAgendaItem } = this.props;

    return (
      <div styleName='list'>
        <div styleName='header'>
          <i className="fa fa-tag"></i>{" "}Agenda
        </div>
        {
          agendaItems.map(function(agendaItem) {
            return(<AgendaItem
                    key={agendaItem.id}
                    agendaItem={agendaItem}
                    selectAgendaItem={selectAgendaItem}
                    selected={agendaItem.id === selectedId}
                    updateAgendaItem={updateAgendaItem}
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
