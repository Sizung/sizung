import React, { Component, PropTypes } from 'react';
import Deliverable from './Deliverable';
import { Glyphicon } from 'react-bootstrap';

class DeliverableList extends Component {
  render() {
    const { deliverables, selectDeliverable, selectedDeliverableId } = this.props;

    return (
      <div className='deliverableList padding-xs-horizontal'>
        <div className='deliverableListHeader padding-sm'>
          <i className='fa fa-tasks'></i>{" "}Deliverables
        </div>
        {
          deliverables.map(function(deliverable) {
            return(<Deliverable
                    key={deliverable.id}
                    deliverable={deliverable}
                    selectDeliverable={selectDeliverable}
                    selected={deliverable.id === selectedDeliverableId}
                />);
          })
        }
      </div>
    );
  }
}

DeliverableList.propTypes = {
  selectedDeliverableId: PropTypes.string,
  selectDeliverable: PropTypes.func.isRequired,
  deliverables: PropTypes.object.isRequired,
};

export default DeliverableList;
