import React, { Component, PropTypes } from 'react';
import User from "./../User";
import SelectableUser from "./../SelectableUser";
import CSSModules from 'react-css-modules';
import styles from "./index.css";

@CSSModules(styles)
class ConversationMemberList extends React.Component {

  constructor() {
    super();

    //this.conversationMembers = [];
    //this.organizationMembers = [];
    //this.allOrganizationMembers = [];
    //var newObj = {};
    //for (var i = 0; i < 5; i++) {
    //  newObj = {};
    //  newObj.id = 'C' + i;
    //  newObj.firstName = 'C';
    //  newObj.lastName = '' + i;
    //  newObj.email = i + 'a@b.com';
    //  newObj.name = 'C' + i;
    //  newObj.presenceStatus = (i % 2 == 0 ? "online" : "offline");
    //  this.conversationMembers.push(newObj);
    //}
    //for (var i = 0; i < 10; i++) {
    //  newObj = {};
    //  newObj.id = 'O' + i;
    //  newObj.firstName = 'O';
    //  newObj.lastName = '' + i;
    //  newObj.email = i + 'a@b.com';
    //  newObj.name = 'O' + i;
    //  newObj.presenceStatus = (i % 2 == 0 ? "online" : "offline");
    //  this.organizationMembers.push(newObj);
    //}
    //this.allOrganizationMembers = this.organizationMembers.slice(0);



    this.state = {
      filter : "",
      edit: false,
      conversationMemberListUpdated: false,
      firstTime: true
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyDown     = this.handleKeyDown.bind(this);
    this.handleFilterChange     = this.handleFilterChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.renderOrganizationMemberList = this.renderOrganizationMemberList.bind(this);
    this.renderConversationMemberList = this.renderConversationMemberList.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();
      console.log("Clicked: " + $(e.currentTarget));
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

  addMemberToConversation(j) {
    console.log("Adding member to conversation: " + j + ", " + JSON.stringify(this.organizationMembers.get(j)));
    console.log("Before Conversation member count: " + this.conversationMembers.size);
    this.conversationMembers.push(this.organizationMembers.get(j));
    console.log("After Conversation member count: " + this.conversationMembers.size);
    this.setState({ conversationMemberListUpdated : true});
  }

  removeMemberFromConversation(j) {
    this.props.createConversationMember(this.props.currentConversation.id, this.organizationMembers.get(j).id);
    this.setState({ conversationMemberListUpdated : true});
    //console.log("Removing member from conversation: " + j + ", " + this.organizationMembers.get(j).email);
    //for ( var i=0 ; i<this.conversationMembers.size ; i++ ) {
    //  if ( this.conversationMembers.get(i).id == this.organizationMembers.get(j).id ) {
    //    console.log("Found");
    //    this.conversationMembers.splice(i,1);
    //    this.setState({ conversationMemberListUpdated : true});
    //    break;
    //  }
    //}
  }

  handleMemberSelection(i) {
    console.log("Member Clicked :" + this.organizationMembers[i].email);
  }

  componentDidUpdate() {
    if ( this.state.conversationMemberListUpdated )
    this.setState({ conversationMemberListUpdated : false});

  }

  componentDidMount() {
    this.setState({ firstTime : false});
    this.allOrganizationMembers = this.props.organisationMembers;
    this.organizationMembers = this.props.organisationMembers;
    this.conversationMembers = this.props.conversationMembers.size == 0? new Array() : this.props.conversationMembers;
  }

  handleFilterChange(event) {
    this.setState({filter: event.target.value});
    console.log("filter: " + event.target.value);

    const filteredOptions = this.filteredOptions(event.target.value, this.allOrganizationMembers);
    this.organizationMembers = filteredOptions;
    console.log("Filtered objects : " + filteredOptions.size);
  }

  renderOrganizationMemberList() {
    if ( null != this.conversationMembers) {
      console.log("Render Organisation members: " + this.organizationMembers.size);
      return (
          this.organizationMembers.map(function (user, i) {
            return (
                <SelectableUser user={user} key={i}
                                addMemberToConversation={this.addMemberToConversation.bind(this,i)}
                                removeMemberFromConversation={this.removeMemberFromConversation.bind(this,i)}/>
            );
          }, this));
    }
    return null;
  }

  renderConversationMemberList() {
    if ( null != this.conversationMembers) {
      console.log("Render Conversation members: " + this.conversationMembers.size);

      return (
          this.conversationMembers.map(function (user) {
            return (<User key={user.id} user={user} showName={false}
                          style={{display: 'inline-block', marginTop: '5px', marginBottom: '5px', marginRight: '5px'}}/>);
          }));
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

    const filteredOptions = this.filteredOptions(filter, this.organizationMembers);
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
    console.log("Rendering");
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
                    <input ref="filterMemberName" type="text" className="col-xs-12 form-control" id="memberName"
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
  organisationMembers: PropTypes.object.isRequired,
  conversationMembers: PropTypes.object.isRequired,
  toggleConversationMembersView: PropTypes.func.isRequired,
  createConversationMember: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired
};

export default ConversationMemberList;
