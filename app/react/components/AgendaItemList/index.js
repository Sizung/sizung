import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class AgendaItemList extends Component {

  constructor() {
    super();
    this.scrollList = this.scrollList.bind(this);
  }

  componentDidMount() {
    $(this.refs.agendaItemList.getDOMNode()).scrollTop(0);
  }

  scrollList() {
    const _this = this;
    window.requestAnimationFrame(() => {
      const node = _this.refs.agendaItemList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  render() {
    const { agendaItems, selectAgendaItem, visitAgendaItem, selectedId, updateAgendaItem } = this.props;
    return (
      <div styleName="root">
        <div styleName="header">
          <h5 style={{ margin: '5px', fontWeight: 'bold' } }><img className="pull-right" src={"/icons/agenda-item-icon-white.png"}></img>AGENDA</h5>
        </div>
        <div ref="agendaItemList" styleName="list">
          {
            agendaItems.map((agendaItem) => {
              return (
                <AgendaItem
                  key={agendaItem.id}
                  agendaItem={agendaItem}
                  selectAgendaItem={selectAgendaItem}
                  selected={agendaItem.id === selectedId}
                  updateAgendaItem={updateAgendaItem}
                  visitAgendaItem={visitAgendaItem}
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
  selectAgendaItem: PropTypes.func.isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
};

export default AgendaItemList;
