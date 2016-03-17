import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import AgendaItemIcon from '../AgendaItemIcon';
import styles from './index.css';

class AgendaItemList extends Component {
  static propTypes = {
    agendaItems: PropTypes.object.isRequired,
    visitAgendaItem: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.refs.agendaItemList.scrollTop = 0;
  }

  scrollList = () => {
    const _this = this;
    window.requestAnimationFrame(() => {
      const node = _this.refs.agendaItemList;
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  render() {
    const { agendaItems,
            selectAgendaItem,
            visitAgendaItem,
            selectedAgendaItemId,
            updateAgendaItem,
            archiveAgendaItem,
    } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
           <AgendaItemIcon inverted size={'large'} />
          </div>
          <div className={styles.titleContainer}>
            AGENDAS
          </div>
        </div>
        <div ref="agendaItemList" className={styles.list}>
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
                  organizationContext={!this.props.conversationId}
                  archiveAgendaItem={archiveAgendaItem}
                />);
            })
          }
        </div>
      </div>
    );
  }
}

export default AgendaItemList;
