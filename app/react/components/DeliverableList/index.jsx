import React, { Component, PropTypes } from 'react';
import Deliverable from './../Deliverable/index';
import Icon from './../Icon';
import styles from './index.css';

class DeliverableList extends Component {
  static propTypes = {
    selectedDeliverableId: PropTypes.string,
    visitDeliverable: PropTypes.func.isRequired,
    deliverables: PropTypes.object.isRequired,
    updateDeliverable: PropTypes.func,
    archiveDeliverable: PropTypes.func,
    context: PropTypes.string,
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
          <Icon type="deliverable" gap="10px">
            TO DO
          </Icon>
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
                  context={this.props.context}
                />);
            })
          }
        </div>
      </div>
    );
  }
}

export default DeliverableList;
