import React, { Component, PropTypes } from 'react';
import Deliverable from './../Deliverable/index';
import DeliverableIcon from './../DeliverableIcon';
import styles from './index.css';

class DeliverableList extends Component {
  static propTypes = {
    selectedDeliverableId: PropTypes.string,
    visitDeliverable: PropTypes.func.isRequired,
    deliverables: PropTypes.object.isRequired,
    updateDeliverable: PropTypes.func.isRequired,
    archiveDeliverable: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.deliverableListSize = 0;
  }

  componentDidMount() {
    const deliverableList = this.refs.deliverableList;
    if (deliverableList) {
      deliverableList.scrollTop = 0;
    }
  }

  componentDidUpdate() {
  }

  scrollList() {
    const _this = this;
    window.requestAnimationFrame(() => {
      const node = _this.refs.deliverableList;
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  render() {
    const { deliverables,
            visitDeliverable,
            selectedDeliverableId,
            updateDeliverable,
            archiveDeliverable,
    } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.header}>
            <div className={styles.iconContainer}>
              <DeliverableIcon size={'large'} />
            </div>
            <div className={styles.titleContainer}>
              DELIVERABLES
            </div>
        </div>
        <div ref="deliverableList" className={styles.list}>
          {
            deliverables.map((deliverable) => {
              return (
                <Deliverable
                  key={deliverable.id}
                  deliverable={deliverable}
                  visitDeliverable={visitDeliverable}
                  selected={deliverable.id === selectedDeliverableId}
                  updateDeliverable={updateDeliverable}
                  archiveDeliverable={archiveDeliverable}
                  conversationContext={!this.props.agendaItemId}
                />);
            })
          }
        </div>
      </div>
    );
  }
}

export default DeliverableList;
