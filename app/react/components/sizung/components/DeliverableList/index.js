import React, { Component, PropTypes } from 'react';
import Deliverable from './../Deliverable/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableList extends Component {

  constructor() {
    super();

    this.scrollElement = this.scrollElement.bind(this);

    this.state = {
      deliverableCount: 0
    };
  }
  scrollElement() {
    var _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.deliverableList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  componentDidUpdate() {
    //TODO: find and alternative way to scroll on adding a new component.
    if ( this.props.deliverables.size > this.state.deliverableCount ) {
      this.setState({deliverableCount : this.props.deliverables.size});
      this.scrollElement();
    }
  }

  render() {
    const { deliverables, selectDeliverable, selectedDeliverableId, updateDeliverable } = this.props;

    return (
      <div styleName='root'>
        <div styleName='header'>
          <i className='fa fa-tasks'></i>{" "}Deliverables
        </div>
        <div ref='deliverableList' styleName='list'>
          {
            deliverables.map(function(deliverable) {
              return(<Deliverable
                      key={deliverable.id}
                      deliverable={deliverable}
                      selectDeliverable={selectDeliverable}
                      selected={deliverable.id === selectedDeliverableId}
                      updateDeliverable={updateDeliverable}
                  />);
            })
          }
        </div>
      </div>
    );
  }
}

DeliverableList.propTypes = {
  selectedDeliverableId: PropTypes.string,
  selectDeliverable: PropTypes.func.isRequired,
  deliverables: PropTypes.object.isRequired,
  updateDeliverable: PropTypes.func.isRequired
};

export default DeliverableList;
