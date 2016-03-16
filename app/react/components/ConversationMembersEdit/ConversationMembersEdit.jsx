import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './ConversationMembersEdit.css';
import Immutable from 'immutable';
import UserIcon from '../UserIcon';
import CloseIcon from '../CloseIcon';

class ConversationMembersEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      filter: '',
    };
  }

  handleClick = (e) => {
    e.preventDefault();
    $(e.currentTarget).find('.status').removeClass('fa-check-circle-o');
  };

  addMemberToConversation = (id) => {
    this.setState({ filter: '' });
    this.props.createConversationMember(this.props.currentConversation.get('id'), id);
  };

  removeMemberFromConversation = (id) => {
    this.setState({ filter: '' });
    this.props.deleteConversationMember(id);
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  };

  triggerUpdate = (id) => {
    const existingMember = this.props.conversationMembers.find((member) => {
      return (member.memberId === id);
    });
    if (existingMember) {
      this.removeMemberFromConversation(existingMember.id);
    } else {
      this.addMemberToConversation(id);
    }
    this.triggerCancel();
  };

  triggerCancel = () => {
    this.state = {
      filter: '',
    };
    this.refs.memberFilter.value = '';
  };

  handleInputSubmit = (event) => {
    event.preventDefault();
    const { filter } = this.state;

    const filteredOptions = this.filteredOptions(filter, this.props.organizationMembers);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  };

  filteredOptions = (filter, options) => {
    return options.filter(function (option) {
      return ((option.firstName + ' ' + option.lastName).toLowerCase().indexOf(filter.toLowerCase()) > -1 || (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1);
    });
  };

  handleToggleView = () => {
    this.props.toggleConversationMembersView(!this.props.conversationMembersViewVisible);
  };

  renderConversationMembersEdit = () => {
    if (this.props.conversationMembers) {
      let conversationMembersAsUsers = new Immutable.List();
      this.props.conversationMembers.toList().map((user) => {
        this.props.organizationMembers.forEach((obj) => {
          if (obj.id === user.memberId) {
            conversationMembersAsUsers = conversationMembersAsUsers.push(obj);
          }
        });
      });
      return (
        conversationMembersAsUsers.filter((member) => {
          return (member.presenceStatus === 'online');
        }).sortBy((member) => {
          return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
        }).concat(conversationMembersAsUsers.filter((member) => {
          return (member.presenceStatus === 'offline');
        }).sortBy((member) => {
          return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
        })).map((conversationMember) => {
          return (<User key={conversationMember.id} user={conversationMember} showName={false}
            style={{ display: 'inline-block', marginTop: '5px', marginBottom: '5px', marginRight: '5px' }}
          />);
        })
      );
    }
    return '';
  };

  renderOrganizationMemberList = () => {
    if (this.props.conversationMembers) {
      return (
          this.filteredOptions(this.state.filter, this.props.organizationMembers.toList()).filter((member) => {
            return (member.presenceStatus === 'online');
          }).sortBy((member) => {
            return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
          }).concat(this.filteredOptions(this.state.filter, this.props.organizationMembers).filter((member) => {
            return (member.presenceStatus === 'offline');
          }).sortBy((member) => {
            return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
          })).map((user) => {
            const existingMember = this.props.conversationMembers.find((member) => {
              return (member.memberId === user.id);
            });
            const selected = (existingMember ? true : false);
            return (
                <div className={styles.organizationMember}>
                  <SelectableUser key={user.id} user={user} selected={selected} onUpdate={this.triggerUpdate} />
                </div>
            );
          }, this));
    }
    return null;
  };

  render() {
    if (this.props.conversationMembersViewVisible) {
      return (
          <div className={styles.root}>
            <div className={styles.fullWidthContainer}>
              <span className={styles.conversationMemberTitle}>
                {'#' + this.props.currentConversation.get('title') + ' - Members'}
              </span>
              <span className={styles.closeButton} onClick={this.handleToggleView}><CloseIcon type={'transparent'}/></span>
            </div>
            <div className={styles.conversationMemberList}>
              {this.renderConversationMembersEdit()}
            </div>
            <div className={styles.fullWidthContainer}>
              <div className={styles.organizationMemberTitle}>
                {'Organization Members'}
              </div>
              <form>
                <div className={styles.inputContainer}>
                  <input ref="memberFilter" type="text" className={styles.input} id="memberName"
                         placeholder="Search" onKeyDown={this.handleKeyDown}
                         onChange={this.handleFilterChange}
                      />
                </div>
              </form>
              <div className={styles.organizationMembersContainer}>
                {this.renderOrganizationMemberList()}
              </div>
            </div>
          </div>
      );
    }
    return false;
  };
}

ConversationMembersEdit.propTypes = {
  organizationMembers: PropTypes.object,
  conversationMembers: PropTypes.object,
  createConversationMember: PropTypes.func.isRequired,
  deleteConversationMember: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired,
  conversationMembersViewVisible: PropTypes.bool.isRequired,
  toggleConversationMembersView: PropTypes.func,
};

export default ConversationMembersEdit;
