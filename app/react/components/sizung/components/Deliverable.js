// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { Component, PropTypes } from 'react';

class Deliverable extends React.Component {
    render() {
        return <div> {this.props.body} </div>;
    }
}

Deliverable.propTypes = {
    body: PropTypes.string.isRequired
}

export default Deliverable;