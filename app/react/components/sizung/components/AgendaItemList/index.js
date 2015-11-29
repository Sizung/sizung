import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItemList extends Component {

  constructor() {
    super();

    this.scrollElement = this.scrollElement.bind(this);
  }
  scrollElement() {
    var _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.agendaItemList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  componentDidUpdate() {
      //TODO: find and alternative way to scroll. Currently any render on the list scrolls it down to the bottom
      //this.scrollElement();
  }

  render() {
    const { agendaItems, selectAgendaItem, selectedId, updateAgendaItem } = this.props;
    return (
      <div styleName='root'>
        <div styleName='header'>
          <i className="fa fa-tag"></i>{" "}Agenda
        </div>
        <div ref='agendaItemList' styleName='list'>
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
      </div>
    );
  }
}

AgendaItemList.propTypes = {
  agendaItems: PropTypes.object.isRequired,
  selectAgendaItem: PropTypes.func.isRequired
};

export default AgendaItemList;
