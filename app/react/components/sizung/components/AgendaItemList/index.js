import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class AgendaItemList extends Component {

  constructor() {
    super();

    this.scrollList = this.scrollList.bind(this);

    this.agendaItemListSize =  0;

  }

  scrollList() {
    var _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.agendaItemList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  componentDidUpdate() {
      //TODO: find and better alternative way to scroll on adding new component.
    //if ( this.props.agendaItems.size > this.agendaItemListSize ) {
    //  this.agendaItemListSize =  this.props.agendaItems.size;
    //  this.scrollList();
    //} else {
    //  $(this.refs.agendaItemList.getDOMNode()).scrollTop(0);
    //}
  }

  componentDidMount() {
    $(this.refs.agendaItemList.getDOMNode()).scrollTop(0);
  }

  render() {
    const { agendaItems, selectAgendaItem, selectedId, updateAgendaItem } = this.props;
    return (
      <div styleName='root'>
        <div styleName='header'>
          <h5 style={{margin: '5px', fontWeight: 'bold'}}><img className='pull-right' src={window.location.protocol + "//" + window.location.host + "/icons/agenda-item-icon-white.png"}></img>AGENDA</h5>
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
