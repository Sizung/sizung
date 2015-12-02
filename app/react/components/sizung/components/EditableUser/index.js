import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

import User from '../User/index';
import UserListApp from '../../containers/UserListApp';

@CSSModules(styles)
class EditableUser extends React.Component {
  constructor() {
    super();
    this.state = {edit: false, filter: ''};

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange     = this.handleChange.bind(this);
    this.handleKeyDown     = this.handleKeyDown.bind(this);
    this.handleFilterChange     = this.handleFilterChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.triggerCancel = this.triggerCancel.bind(this);
  }

  handleEditClick(event) {
    this.setState({edit: true});
  }

  handleChange(event) {
    this.triggerUpdate(event.value);
  }

  triggerUpdate(id) {
    console.log('triggerUpdate: ', id);
    this.props.onUpdate(id);
    this.setState({edit: false, filter: ''});
  }

  triggerCancel() {
    this.setState({edit: false, filter: ''});
  }


  handleFilterChange(event) {
    this.setState({filter: event.target.value});
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleInputSubmit();
    }
    else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  handleUserClick(id) {
    this.triggerUpdate(id);
  }

  handleInputSubmit() {
    const { filter } = this.state;
    const filteredOptions = this.filteredOptions(filter, this.props.users);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  renderShow(selectedUser) {
    return <div onClick={this.handleEditClick}><User user={selectedUser} /></div>
  }

  filteredOptions(filter, options) {
    return options.filter(function(user){
      const name = (user.firstName + ' ' + user.lastName).toLowerCase();
      return name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    })
  }

  selectedMarker(selectedUser, user) {
    if (selectedUser === user) {
      return <i className="fa fa-check pull-right" style={{color: 'green', marginTop: '1em'}}></i>
    }
  }

  renderEdit(selectedUser, users) {
    const options = this.filteredOptions(this.state.filter, users).map((user) => {
      return (
        <div style={{lineHeight: '3em'}} onClick={() => this.handleUserClick(user.id)} key={user.id}>
          <User user={user} style={{display: 'inline-block'}}/>
          &nbsp;&nbsp;
          {user.firstName} {user.lastName}
          {this.selectedMarker(selectedUser, user)}
        </div>
      );
    });

    return (
      <div styleName="root">
        <div styleName="title">
          Members
          <i styleName="close-icon" onClick={this.triggerCancel}></i>
        </div>
        <input styleName="input" ref="filterInput" type="text" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange} placeholder="Search Members"/>
        <div>
          {options}
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.edit && !prevState.edit) {
      var inputElem = React.findDOMNode(this.refs.filterInput);
      inputElem.focus();
    }
  }

  render() {
    const { user, users } = this.props;
    if (this.state.edit) {
      return (
        <div>
          {this.renderShow(user)}
          {this.renderEdit(user, users)}
        </div>
      );
    }
    else {
      return this.renderShow(user);
    }
  }
}

EditableUser.propTypes = {
  users: PropTypes.object.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    presenceStatus: PropTypes.string.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditableUser;