import React, { Component, PropTypes } from 'react';
import User from "./../User";
import SelectableUser from "./../SelectableUser";
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class ConversationMemberList extends React.Component {

  constructor() {
    super();

    this.state = {
      filter : "",
      isConversationMemberListUpdated: false
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.renderOrganizationMemberList = this.renderOrganizationMemberList.bind(this);
    this.renderConversationMemberList = this.renderConversationMemberList.bind(this);
    this.addMemberToConversation = this.addMemberToConversation.bind(this);
    this.removeMemberFromConversation = this.removeMemberFromConversation.bind(this);
    this.triggerCancel = this.triggerCancel.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();
      $(e.currentTarget).find('.status').removeClass('fa-check-circle-o');
    };
  }

  addMemberToConversation(id) {
    this.setState({ isConversationMemberListUpdated : true, filter: ""});
    this.props.createConversationMember(this.props.currentConversation.get('id'), id);
  }

  removeMemberFromConversation(id) {
    this.setState({ isConversationMemberListUpdated : true, filter: ""});
    this.props.deleteConversationMember(id);
    console.log("Removed");
  }

  componentDidUpdate() {
    var inputElem = React.findDOMNode(this.refs.memberFilter);
    inputElem.focus();
    if ( this.state.isConversationMemberListUpdated )
      this.setState({ isConversationMemberListUpdated : false});
  }

  handleFilterChange(event) {
    this.setState({filter: event.target.value});
  }

  renderOrganizationMemberList() {
    if ( null != this.props.conversationMembers) {
      var _this = this;
      return (
          _this.filteredOptions(_this.state.filter, _this.props.organizationMembers).map(function (user, i) {
            var existingMember = _this.props.conversationMembers.find(function(member){
              return ( member.memberId === user.id);
            });
            var isSelected = ( null == existingMember ? false : true );
            if ( null != existingMember ) {
              console.log("existingMember: " + JSON.stringify(existingMember));
            }
            console.log("user selected " + user.email + ", " + isSelected + ", " + existingMember);
            return (
                <SelectableUser user={user} key={i}
                                onUpdate={_this.triggerUpdate.bind(_this,user.id)}
                                isSelected={isSelected}/>
            );
          }, this));
    }
    return null;
  }

  renderConversationMemberList() {
    if ( null != this.props.conversationMembers) {
      var _this = this;
      return (
          _this.props.conversationMembers.map(function (user) {
            var conversationMember = null;
            _this.props.organizationMembers.forEach(function(obj){
              if( obj.id === user.memberId ) {
                conversationMember = obj;
              }
            });
             return (<User key={conversationMember.id} user={conversationMember} showName={false}
                            style={{display: 'inline-block', marginTop: '5px', marginBottom: '5px', marginRight: '5px'}}/>);
          })
      );
    }
    return;
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    }
    else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  triggerUpdate(id){
    var existingMember = this.props.conversationMembers.find(function(member){
      return ( member.memberId === id);
    });
    if ( null != existingMember ) {
     this.removeMemberFromConversation(existingMember.id);
    } else {
      this.addMemberToConversation(id);
    }
    this.triggerCancel();
  }

  triggerCancel() {
    this.state = {
      filter : ""
    };
    React.findDOMNode(this.refs.memberFilter).value = "";
  }

  handleInputSubmit(event) {
    event.preventDefault();
    const { filter } = this.state;

    const filteredOptions = this.filteredOptions(filter, this.props.organizationMembers);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  filteredOptions(filter, options) {
    return options.filter(function(option){
      return ( ( option.firstName + " " + option.lastName ).toLowerCase().indexOf(filter.toLowerCase()) > -1 || (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1 );
    })
  }

  render() {
    var _this = this;
      return (

          <div className="row" style={{ margin: '0px' }}>
            <div className="col-xs-12">
              <div className="pull-left">
                <h4>Conversation Members</h4>
              </div>
          <span className="pull-right">
            <i style={{ cursor: 'pointer' }} onClick={this.props.toggleConversationMembersView} className="fa fa-times fa-lg"></i>
          </span>
            </div>
            <div className="col-xs-12">
              {this.renderConversationMemberList()}
            </div>
            <div className="col-xs-12" style={{ marginTop: '10px'}}>
              <form className="col-xs-12 zero-padding">
                <div className="form-group col-xs-12 zero-padding">
                  <div className="col-xs-12 zero-padding">
                    <input ref="memberFilter" type="text" className="col-xs-12 form-control" id="memberName"
                           placeholder="Filter by name"  onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange}/>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-xs-12" style={{ marginTop: '10px'}}>
              <div className="col-xs-12 zero-padding">
                <div className="pull-left">
                  <h4>Organization Members</h4>
                </div>
              </div>
              {this.renderOrganizationMemberList()}
            </div>
          </div>
      );
  }
}

ConversationMemberList.propTypes = {
  organizationMembers: PropTypes.object.isRequired,
  conversationMembers: PropTypes.object.isRequired,
  toggleConversationMembersView: PropTypes.func.isRequired,
  createConversationMember: PropTypes.func.isRequired,
  deleteConversationMember: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired
};

export default ConversationMemberList;
