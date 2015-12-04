import React, { Component, PropTypes } from 'react';
import User from './../User/index';
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class UserList extends Component {
  render() {
    const { users } = this.props;

    return (
      <div>
        {
          users.map(function(user) {
            return(<User key={user.id} user={user} showName={true} style={{display: 'block', marginTop: '5px', marginBottom: '5px'}} />);
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
