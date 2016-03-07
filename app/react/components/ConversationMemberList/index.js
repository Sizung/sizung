import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './index.css';
import Immutable from 'immutable';
import UserIcon from '../UserIcon';

class ConversationMemberList extends React.Component {
  constructor() {
    super();

    this.state = {
      filter: '',
      isOpen: false,
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
    this.setState({ isOpen: !this.state.isOpen });
  };

  renderConversationMemberList = () => {
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
            const isSelected = (existingMember ? true : false);
            return (
                <SelectableUser key={user.id} user={user} isSelected={isSelected} onUpdate={this.triggerUpdate} />
            );
          }, this));
    }
    return null;
  };

  renderClosed = () => {
    const usersCount = this.props.conversationMembers ? this.props.conversationMembers.toList().size : 0;
    return (
      <span className={styles.memberDropdownContainer}>
          <div onClick={this.handleToggleView} aria-haspopup="true" aria-expanded="false">
            <UserIcon inverted size={'x-large'} style={{ paddingTop: '15px' }} />
            <div className={styles.memberBadge}>{usersCount}</div>
          </div>
      </span>
    );
  };

  renderOpened = () => {
    return (
        <div className={styles.rootContainer}>
          <div className={styles.root}>
            <div className={styles.fullWidthContainer}>
              <div className={styles.conversationMemberTitle}>
                <h4>Conversation Members</h4>
              </div>
              <a className={styles.closeButton} onClick={this.handleToggleView}><span aria-hidden="true">&times;</span></a>
            </div>
            <div className={styles.conversationMemberList}>
              {this.renderConversationMemberList()}
            </div>
            <div className={styles.fullWidthContainer}>
              <div className={styles.organizationMemberTitle}>
                <h4>Organization Members</h4>
              </div>
              <form>
                <div className={styles.inputContainer}>
                  <input ref="memberFilter" type="text" className={styles.input} id="memberName"
                    placeholder="Filter by name, email" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange}
                  />
                </div>
              </form>
              {this.renderOrganizationMemberList()}
            </div>
          </div>
        </div>
    );
  };

  render() {
    return this.state.isOpen ? this.renderOpened() : this.renderClosed();
  }
}

ConversationMemberList.propTypes = {
  organizationMembers: PropTypes.object,
  conversationMembers: PropTypes.object,
  createConversationMember: PropTypes.func.isRequired,
  deleteConversationMember: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired,
};

export default ConversationMemberList;
