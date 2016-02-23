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
      $(deliverableList).scrollTop(0);
    }
  }

  componentDidUpdate() {
  }

  scrollList() {
    const _this = this;
    window.requestAnimationFrame(function() {
      var node = _this.refs.deliverableList;
      if (node !== undefined) {
        node.scrollTop = node.scrollHeight;
      }
    });
  }

  render() {
    const { deliverables, visitDeliverable, selectedDeliverableId, updateDeliverable } = this.props;

    return (
      <div styleName={'root'}>
        <div styleName={'header'}>
          <h5 style={{marginTop: '5px', fontWeight: 'bold'}}>
            <DeliverableIcon inverted={true} size={'large'} style={{ marginRight: '5px' }}/>DELIVERABLES</h5>
        </div>
        <div ref='deliverableList' styleName='list'>
          {
            deliverables.map((deliverable) => {
              return(<Deliverable
                      key={deliverable.id}
                      deliverable={deliverable}
                      visitDeliverable={visitDeliverable}
                      selected={deliverable.id === selectedDeliverableId}
                      updateDeliverable={updateDeliverable}
                      conversationContext={this.props.agendaItemId ? false : true}
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
  visitDeliverable: PropTypes.func.isRequired,
  deliverables: PropTypes.object.isRequired,
  updateDeliverable: PropTypes.func,
};

export default DeliverableList;
