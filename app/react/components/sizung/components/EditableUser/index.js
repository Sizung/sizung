import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import { Select, Placeholder, Option } from 'belle';

import User from '../User/index';
import UserListApp from '../../containers/UserListApp';

@CSSModules(styles)
class EditableUser extends React.Component {
  constructor() {
    super();

    this.handleChange     = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onUpdate(event.value);
  }

  renderEdit(selectedUser, users) {
    const options = users.map(function(user) {
      return <Option value={user.id}><User user={user}/></Option>;
    });

    return (
      <div>
        <Select defaultValue={selectedUser.id}
                onUpdate={this.handleChange}
                style={{width: '30px', borderBottom: '0'}}
                caretToOpenStyle={{display: 'none'}}>
          { options }
        </Select>
      </div>
    );
  }

  render() {
    const { user, users } = this.props;
    return this.renderEdit(user, users)
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