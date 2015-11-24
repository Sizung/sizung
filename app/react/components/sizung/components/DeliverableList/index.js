import React, { Component, PropTypes } from 'react';
import Deliverable from './../Deliverable/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableList extends Component {
  render() {
    const { deliverables, selectDeliverable, selectedDeliverableId } = this.props;

    return (
      <div styleName='list'>
        <div styleName='header'>
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
