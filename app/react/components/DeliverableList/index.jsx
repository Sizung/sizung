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

  constructor(props) {
    super();
    this.state = {
      filter: (props.currentTimeline === 'organization' ? 'my' : 'all'),
    };
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

    const filteredDeliverables = (this.state.filter === 'my' ? deliverables.filter((deliverable) => { return (deliverable.ownerId === currentUser.id || deliverable.assigneeId === currentUser.id); }) : deliverables);
    //const filteredDeliverables = deliverables;
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

  renderFilterOptions = () => {
    if (this.props.deliverables.toJS().length > 0) {
      return (
        <div className={styles.filter}>
          <span className={this.state.filter === 'all' ? styles.filterOptionSelected : styles.filterOption} onClick={this.handleFilter.bind(this, 'all')}>All</span>
          <span className={this.state.filter === 'my' ? styles.filterOptionSelected : styles.filterOption} onClick={this.handleFilter.bind(this, 'my')}>My</span>
        </div>
      );
    }
    return undefined;
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <Icon type="deliverable" gap="10px">
            ACTION
          </Icon>
        </div>
        {this.renderFilterOptions()}
        <div ref="deliverableList" className={styles.list}>
          { this.filteredDeliverableList() }
        </div>
      </div>
    );
  }
}

export default DeliverableList;
