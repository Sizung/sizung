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
    currentTimeline: PropTypes.string,
    currentUser: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.deliverableListSize = 0;
    this.state = {
      filter: 'team',
    };
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

  handleFilter = (filter) => {
    this.setState({ filter });
  };

  filteredDeliverableList = () => {
    const { deliverables,
        visitDeliverable,
        selectedDeliverableId,
        updateDeliverable,
        archiveDeliverable,
        currentUser,
        } = this.props;

    const filteredDeliverables = (this.state.filter === 'my' ? deliverables.filter((deliverable) => { return (deliverable.owner.id === currentUser.id || deliverable.assignee.id === currentUser.id); }) : deliverables);
    return (filteredDeliverables.map((deliverable) => {
      return (
          <Deliverable
              key={deliverable.id}
              deliverable={deliverable}
              visitDeliverable={visitDeliverable}
              selected={deliverable.id === selectedDeliverableId}
              updateDeliverable={updateDeliverable}
              archiveDeliverable={archiveDeliverable}
              currentTimeline={this.props.currentTimeline}
              />);
    }));
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <Icon type="deliverable" gap="10px">
            ACTION
          </Icon>
        </div>
        <div className={styles.filter}>
          <span className={this.state.filter === 'team' ? styles.filterOptionSelected : styles.filterOption} onClick={this.handleFilter.bind(this, 'team')}>Team Actions</span>
          <span className={this.state.filter === 'my' ? styles.filterOptionSelected : styles.filterOption} onClick={this.handleFilter.bind(this, 'my')}>My Actions</span>
        </div>
        <div ref="deliverableList" className={styles.list}>
          { this.filteredDeliverableList() }
        </div>
      </div>
    );
  }
}

export default DeliverableList;
