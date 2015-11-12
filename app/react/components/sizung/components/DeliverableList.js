import React, { Component, PropTypes } from 'react';
import Deliverable from './Deliverable';
import { Glyphicon } from 'react-bootstrap';

class DeliverableList extends Component {
  render() {
    const { deliverables } = this.props;

    return (
      <div className='deliverableList'>
        <div className='row deliverableListHeader padding-sm box-shadow'>
          <i className='fa fa-tasks'></i>{" "}<strong>Deliverables</strong>
        </div>
        {
          deliverables.map(function(deliverable) {
            return(<Deliverable
                    key={deliverable.id}
                    deliverable={deliverable}
                />);
          })
        }
      </div>
    );
  }
}

DeliverableList.propTypes = {
  deliverables: PropTypes.object.isRequired
};

export default DeliverableList;
