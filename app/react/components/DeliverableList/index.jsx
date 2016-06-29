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
      filter: (props.currentTimeline === 'organization' ? 'my' : 'team'),
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

  renderFilterOptions = () => {
    if (this.props.deliverables.length > 0) {
      return (
        <div className={styles.filter}>
          <span className={this.state.filter === 'team' ? styles.filterOptionSelected : styles.filterOption}
                onClick={this.handleFilter.bind(this, 'team')}>{this.props.currentTimeline === 'organization' ? 'All Actions' : 'Team Actions'}</span>
          <span className={this.state.filter === 'my' ? styles.filterOptionSelected : styles.filterOption}
                onClick={this.handleFilter.bind(this, 'my')}>My Actions</span>
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
