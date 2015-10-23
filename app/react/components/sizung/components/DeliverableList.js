import React, { Component, PropTypes } from 'react';
import Deliverable from './Deliverable';

class DeliverableList extends Component {
  render() {
    const { deliverables } = this.props;

    return (
      <div className='deliverableList'>
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
