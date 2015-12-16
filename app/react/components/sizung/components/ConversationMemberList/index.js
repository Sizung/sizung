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
      conversationMemberListUpdated: false,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.renderOrganizationMemberList = this.renderOrganizationMemberList.bind(this);
    this.renderConversationMemberList = this.renderConversationMemberList.bind(this);
    this.addMemberToConversation = this.addMemberToConversation.bind(this);
    this.removeMemberFromConversation = this.removeMemberFromConversation.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();
      $(e.currentTarget).find('.status').removeClass('fa-check-circle-o');
    };
  }

  handleSelect(e) {
    e.preventDefault();
    if( !$(e.currentTarget).find('.status i').hasClass('fa-check-circle-o') ) {
      $(e.currentTarget).find('.status i').removeClass('fa-circle-o');
      $(e.currentTarget).find('.status i').addClass('fa-check-circle-o');
    } else {
      $(e.currentTarget).find('.status i').addClass('fa-circle-o');
      $(e.currentTarget).find('.status i').removeClass('fa-check-circle-o');
    }
  }

  addMemberToConversation(id) {
    this.setState({ conversationMemberListUpdated : true, filter: ""});
    this.props.createConversationMember(this.props.currentConversation.get('id'), id);
  }

  removeMemberFromConversation(id) {
    this.setState({ conversationMemberListUpdated : true, filter: ""});
    this.props.deleteConversationMember(id);
  }

  componentDidUpdate() {
    if ( this.state.conversationMemberListUpdated )
    this.setState({ conversationMemberListUpdated : false});

  }

  handleFilterChange(event) {
    this.setState({filter: event.target.value});
  }

  renderOrganizationMemberList() {
    if ( null != this.props.conversationMembers) {
      var _this = this;
      return (
          _this.filteredOptions(_this.state.filter, _this.props.organizationMembers).map(function (user, i) {
            var isSelected = false;
            var selectedId = null;
            _this.props.conversationMembers.map( function(c, index, arr){
              if ( user.id === c.memberId ) {
                isSelected = true;
                selectedId = c.id;
              }
            });
            return (
                <SelectableUser user={user} key={i}
                                addMemberToConversation={_this.addMemberToConversation.bind(_this,user.id)}
                                removeMemberFromConversation={_this.removeMemberFromConversation.bind(_this,selectedId)}
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
    return null;
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleInputSubmit();
    }
    else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  handleInputSubmit() {
    const { filter } = this.state;

    const filteredOptions = this.filteredOptions(filter, this.props.organizationMembers);
    if (filter.size > 0 && filteredOptions.size > 0) {
      console.log('enter on ', filteredOptions.first().id);
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  filteredOptions(filter, options) {
    return options.filter(function(option){
      return ( ( option.firstName + " " + option.lastName ).toLowerCase().indexOf(filter.toLowerCase()) > -1 );
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
              <form className="col-xs-10 zero-padding">
                <div className="form-group col-xs-12 zero-padding">
                  <div className="col-xs-12 zero-padding">
                    <input ref="memberFilter" type="text" className="col-xs-12 form-control" id="memberName"
                           placeholder="Enter member name"  onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange}/>
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
