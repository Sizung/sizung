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
            return(<div>
              <div style={{ display: 'table-cell', padding: '5px;' , verticalAlign: 'top'}}>
                <User key={user.id} user={user}/>
              </div>
              <div style={{ display: 'table-cell', padding: '5px;', verticalAlign: 'top'  }}>
                {user.firstName + " " + user.lastName}
              </div>
            </div> );
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
