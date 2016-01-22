import React, { Component, PropTypes } from 'react';
import Deliverable from './../Deliverable/index';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class DeliverableList extends Component {

  constructor() {
    super();

    this.scrollList = this.scrollList.bind(this);

    this.deliverableListSize = 0;
  }
  scrollList() {
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
    //if ( this.props.deliverables.size > this.deliverableListSize ) {
    //  this.deliverableListSize = this.props.deliverables.size;
    //  this.scrollList();
    //} else {
    //  $(this.refs.deliverableList.getDOMNode()).scrollTop(0);
    //}
  }

  componentDidMount() {
    $(this.refs.deliverableList.getDOMNode()).scrollTop(0);
  }

  render() {
    const { deliverables, selectDeliverable, selectedDeliverableId, updateDeliverable } = this.props;

    return (
      <div styleName='root'>
        <div styleName='header'>
          <h5 style={{margin: '5px', fontWeight: 'bold'}}><img className='pull-right' src={"/icons/deliverable-icon-white.png"}></img>DELIVERABLES</h5>
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
