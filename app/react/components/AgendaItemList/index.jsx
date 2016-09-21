import React, { Component, PropTypes } from 'react';
import AgendaItem from './../AgendaItem/index';
import Icon from '../Icon';
import styles from './index.css';

class AgendaItemList extends Component {
  static propTypes = {
    agendaItems: PropTypes.object.isRequired,
    visitAgendaItem: PropTypes.func.isRequired,
    currentTimeline: PropTypes.string,
    labels: PropTypes.object.isRequired,
    setComposerState: PropTypes.object.isRequired,
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
          <Icon type="agendaItem">
            { this.props.labels.agendaItemLabel }
          </Icon>
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
                  currentTimeline={this.props.currentTimeline}
                  archiveAgendaItem={archiveAgendaItem}
                  setComposerState={this.props.setComposerState}
                />);
            })
          }
        </div>
      </div>
    );
  }
}

export default AgendaItemList;
