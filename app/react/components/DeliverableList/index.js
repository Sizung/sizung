import React, { Component, PropTypes } from 'react';
import Deliverable from './../Deliverable/index';
import DeliverableIcon from './../DeliverableIcon';
import { Glyphicon } from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class DeliverableList extends Component {

  constructor() {
    super();

    this.scrollList = this.scrollList.bind(this);

    this.deliverableListSize = 0;
  }

  componentDidMount() {
    const deliverableList = this.refs.deliverableList;
    if (deliverableList) {
      $(deliverableList.getDOMNode()).scrollTop(0);
    }
  }

  componentDidUpdate() {
  }

  scrollList() {
    const _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.deliverableList.getDOMNode();
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  render() {
    const { deliverables, selectDeliverable, selectedDeliverableId, updateDeliverable } = this.props;

    return (
      <div styleName={'root'}>
        <div styleName={'header'}>
          <span style={{ margin: '5px', fontWeight: 'bold' }} className={'pull-left'}>
            DELIVERABLES</span>
          <div className={'pull-right'}><DeliverableIcon inverted={true} size={'large'}/></div>
        </div>
        <div ref='deliverableList' styleName='list'>
          {
            deliverables.map((deliverable) => {
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
  updateDeliverable: PropTypes.func,
};

export default DeliverableList;
