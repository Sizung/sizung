import React, { Component, PropTypes } from 'react';
import User from './User';

class UserList extends Component {
  render() {
    const { users } = this.props;

    return (
      <div>
        {
          users.map(function(user) {
            return(<User key={user.id} user={user} />);
          })
        }
      </div>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.object.isRequired
};

export default UserList;
