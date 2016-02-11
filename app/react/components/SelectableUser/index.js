import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import User from '../User/index';


@CSSModules(styles)
class SelectableUser extends React.Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    this.props.onUpdate(this.props.user.id);
  }

  render() {
    const { user, users, isSelected } = this.props;
    var selectionStyle = ( isSelected ? "selected" : "unselected");
    return (
        <div onClick={this.handleSelect} styleName='root'>
          <div styleName='user-container'>
            <User key={user.id} user={user} showName={true} showEmail={true} styleName='user'/>
          </div>
          <div styleName='status'>
            <i styleName={selectionStyle}></i>
          </div>
        </div>
    );
  }
}

SelectableUser.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    presenceStatus: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default SelectableUser;