import React, { Component, PropTypes } from 'react';
import Deliverable from './Deliverable';
import { Glyphicon } from 'react-bootstrap';

class DeliverableList extends Component {
  render() {
    const { deliverables } = this.props;

    return (
      <div className='deliverableList'>
        <div className='deliverableListHeader padding-sm-vertical'>
          <i className='fa fa-tasks'></i>{" "}Deliverables
        </div>
        {
          deliverables.map(function(deliverable) {
            return(<Deliverable
                    key={deliverable.id}
                    body={deliverable.body}
                    conversationTitle={deliverable.conversationTitle}
                    assignee={deliverable.assignee}
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
