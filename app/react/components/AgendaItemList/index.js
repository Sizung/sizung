import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
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
    $(this.refs.agendaItemList).scrollTop(0);
  }
  
  scrollList() {
    const _this = this;
    window.requestAnimationFrame(() => {
      const node = _this.refs.agendaItemList;
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  render() {
    const { agendaItems, selectAgendaItem, visitAgendaItem, selectedAgendaItemId, updateAgendaItem, archiveAgendaItem } = this.props;
    return (
      <div styleName='root'>
        <div styleName='header'>
          <span className={styles.iconContainer}>
            <AgendaItemIcon inverted={true} size={'large'}/>
          </span>
          <span className={styles.titleContainer}>
            {'AGENDAS'}
          </span>
        </div>
        <div ref="agendaItemList" styleName="list">
          {
            agendaItems.map((agendaItem) => {
              return (
                <AgendaItem
                  key={agendaItem.id}
                  agendaItem={agendaItem}
                  selectAgendaItem={selectAgendaItem}
                  selected={agendaItem.id === selectedAgendaItemId}
                  updateAgendaItem={updateAgendaItem}
                  visitAgendaItem={visitAgendaItem}
                  organizationContext={this.props.conversationId ? false : true}
                  archiveAgendaItem={archiveAgendaItem}
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
  visitAgendaItem: PropTypes.func.isRequired,
};

export default AgendaItemList;
