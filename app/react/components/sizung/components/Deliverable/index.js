// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import User from '../User.js';

@CSSModules(styles)
class Deliverable extends React.Component {
  constructor() {
    super();

    this.handleClick = (e) => {
      e.preventDefault();

      this.props.selectDeliverable(
        this.props.deliverable.agendaItem.conversationId,
        this.props.deliverable.agendaItem.id,
        this.props.deliverable.id
      );
    };
  }


    render() {
      const { deliverable, selected } = this.props;
      const { title, agendaItem} = deliverable;

      var styleName = 'default';
      if(selected === true) {
        styleName = 'selected';
      }

        return <div styleName={styleName} onClick={this.handleClick}>
          <div styleName='title-row'>
            <div styleName='title'>{ title }</div>
            <i styleName='deliverable-icon'></i>
          </div>
          <div styleName='details-row'>
            <User/>
            <div styleName='agenda-title'># {agendaItem.title}</div>
          </div>
        </div>;

    }
}

Deliverable.propTypes = {
  deliverable: PropTypes.shape({
    title: PropTypes.string.isRequired,
    agendaItem: PropTypes.object.isRequired
  }).isRequired,
  selectDeliverable: PropTypes.func.isRequired
};

Deliverable.defaultProps = {
  deliverable: {
    title: 'foobar',
    agendaItem: {
      title: 'barfoo'
    }
  }
};

export default Deliverable;