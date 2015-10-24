// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Deliverable extends React.Component {
    render() {
        return <div className="row well well-small"> <strong className="col-xs-12">{ this.props.body }</strong></div>;

    }
}

Deliverable.propTypes = {
    body: PropTypes.string.isRequired
};

export default Deliverable;