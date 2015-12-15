import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from "./index.css";
import User from '../User/index';


@CSSModules(styles)
class SelectableUser extends React.Component {
  constructor() {
    super();
    this.state = {selected: false};

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    !this.state.selected ? this.props.addMemberToConversation() : this.props.removeMemberFromConversation();
    this.setState({selected: !this.state.selected});
  }

  render() {
    const { user, users } = this.props;
    var selectionStyle = ( this.state.selected ? "selected" : "unselected");
    return (
        <div onClick={this.handleSelect} styleName='root' className="col-xs-12 col-md-6" style={{ padding: '10px', cursor: 'pointer'}}>
          <div className="col-xs-10 zero-padding">
            <User key={user.id} user={user} showName={true} style={{display: 'inline-block', marginTop: '5px', marginBottom: '5px', marginRight: '5px'}} />
          </div>
          <div className="col-xs-2 zero-padding status" style={{ padding: '10px'}}>
            <i styleName={selectionStyle}></i>
          </div>
        </div>
    );
  }
}

SelectableUser.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    presenceStatus: PropTypes.string.isRequired
  }).isRequired,
  addMemberToConversation: PropTypes.func.isRequired,
  removeMemberFromConversation: PropTypes.func.isRequired
};

export default SelectableUser;