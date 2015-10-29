import React, { Component, PropTypes } from 'react';
import Deliverable from './Deliverable';
import { Glyphicon } from 'react-bootstrap';

class DeliverableList extends Component {
  render() {
    const { deliverables } = this.props;

    return (
      <div className='deliverableList'>
        <div className='deliverableListHeader padding-sm'>
          <Glyphicon glyph="tasks" />{" "}Deliverables
        </div>
        {
          deliverables.map(function(deliverable) {
            return(<Deliverable
                    key={deliverable.id}
                    body={deliverable.body}
                    //conversationTitle={deliverable.conversation.converstaionTitle}
                    //commentsSize={deliverable.comments.size()}
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
