import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class ConversationMemberList extends React.Component {

  constructor() {
    super();

    this.state = {
      filter: '',
      isConversationMemberListUpdated: false,
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
    this.setState({ isConversationMemberListUpdated : true, filter: '' });
    this.props.createConversationMember(this.props.currentConversation.get('id'), id);
  }

  removeMemberFromConversation(id) {
    this.setState({ isConversationMemberListUpdated : true, filter: '' });
    this.props.deleteConversationMember(id);
  }

  componentDidUpdate() {
    const inputElem = React.findDOMNode(this.refs.memberFilter);
    inputElem.focus();
    if (this.state.isConversationMemberListUpdated) {
      // TODO: Need to fix this. SetState should not be used in ComponentDidUpdate
      this.setState({ isConversationMemberListUpdated : false });
    }
  }

  handleFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  renderOrganizationMemberList() {
    if (this.props.conversationMembers !== null) {
      const _this = this;
      return (
          _this.filteredOptions(_this.state.filter, _this.props.organizationMembers).map(function (user, i) {
            var existingMember = _this.props.conversationMembers.find(function (member) {
              return (member.memberId === user.id);
            });
            const isSelected = (null === existingMember ? false : true);
            return (
                <SelectableUser user={user} key={i}
                                onUpdate={_this.triggerUpdate.bind(_this, user.id)}
                                isSelected={isSelected}
                />
            );
          }, this));
    }
    return null;
  }

  renderConversationMemberList() {
    if (this.props.conversationMembers != null) {
      const _this = this;
      return (
          _this.props.conversationMembers.map(function (user) {
            let conversationMember = null;
            _this.props.organizationMembers.forEach(function (obj) {
              if (obj.id === user.memberId) {
                conversationMember = obj;
              }
            });
            return (<User key={conversationMember.id} user={conversationMember} showName={false}
              style={{ display: 'inline-block', marginTop: '5px', marginBottom: '5px', marginRight: '5px' }}
            />);
          })
      );
    }
    return '';
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  triggerUpdate(id) {
    let existingMember = this.props.conversationMembers.find(function (member) {
      return (member.memberId === id);
    });
    if (existingMember != null) {
      this.removeMemberFromConversation(existingMember.id);
    } else {
      this.addMemberToConversation(id);
    }
    this.triggerCancel();
  }

  triggerCancel() {
    this.state = {
      filter: '',
    };
    React.findDOMNode(this.refs.memberFilter).value = '';
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
    return options.filter(function (option) {
      return ((option.firstName + ' ' + option.lastName ).toLowerCase().indexOf(filter.toLowerCase()) > -1 || (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1 );
    });
  }

  render() {
    return (
        <div styleName='root'>
          <div styleName='full-width-container'>
            <div styleName='conversation-member-title'>
              <h4>Conversation Members</h4>
            </div>
            <a styleName='close-button' onClick={this.props.toggleConversationMembersView}><span aria-hidden="true">&times;</span></a>
          </div>
          <div styleName='full-width-container'>
            {this.renderConversationMemberList()}
          </div>
          <div styleName='full-width-container'>
            <form styleName='form-container'>
              <div styleName='input-container'>
                <input ref="memberFilter" type="text" styleName='input' id="memberName"
                  placeholder="Filter by name, email" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange}
                />
              </div>
            </form>
          </div>

          <div styleName='full-width-container'>
            <div styleName='organization-member-container'>
              <div styleName='organization-member-title'>
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
  currentConversation: PropTypes.object.isRequired,
};

export default ConversationMemberList;
