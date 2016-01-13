import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import AgendaItemIcon from '../AgendaItemIcon';
import styles from './index.css';

@CSSModules(styles)
class AgendaItemList extends Component {

  constructor() {
    super();

    this.scrollList = this.scrollList.bind(this);

    this.agendaItemListSize =  0;
  }

  componentDidMount() {
    $(this.refs.agendaItemList.getDOMNode()).scrollTop(0);
  }

  componentDidUpdate() {

  }

  scrollList() {
    const _this = this;
    window.requestAnimationFrame(function() {
      const node = _this.refs.agendaItemList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }


  render() {
    const { agendaItems, selectAgendaItem, selectedId, updateAgendaItem } = this.props;
    return (
      <div styleName='root'>
        <div styleName='header'>
          <h5 style={{margin: '5px', fontWeight: 'bold'}}>
            <span className='pull-right'><AgendaItemIcon inverted={true} size={'large'}/></span>AGENDA</h5>
        </div>
        <div ref='agendaItemList' styleName='list'>
          {
            agendaItems.map(function (agendaItem) {
              return (
                <AgendaItem
                  key={agendaItem.id}
                  agendaItem={agendaItem}
                  selectAgendaItem={selectAgendaItem}
                  selected={agendaItem.id === selectedId}
                  updateAgendaItem={updateAgendaItem}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

AgendaItemList.propTypes = {
  agendaItems: PropTypes.object.isRequired,
  selectAgendaItem: PropTypes.func.isRequired,
};

export default AgendaItemList;
