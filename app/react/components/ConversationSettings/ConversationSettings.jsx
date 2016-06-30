import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './ConversationSettings.css';
import Immutable from 'immutable';
import SizungInput from '../SizungInput';
import Icon from '../Icon';

class ConversationSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      conversationTitle: props.conversationSettingsViewState === 'edit' ? props.currentConversation.title : '',
      conversationMembers: props.conversationSettingsViewState === 'edit' ? props.conversationMembersAsUsers : (new Immutable.List()).push(props.currentUser),
      organizationMembers: props.organizationMembers,
    };
  }

  addMemberToConversation = (member) => {
    this.setState({ conversationMembers: this.state.conversationMembers.push(member), filter: '' });
  };

  removeMemberFromConversation = (member) => {
    this.setState({ conversationMembers: this.state.conversationMembers.filter((convMember) => { return convMember.id !== member.id }), filter: '' });
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  };

  triggerUpdate = (id) => {
    const existingMember = (this.state.conversationMembers ? this.state.conversationMembers.find((member) => {
      return (member.id === id);
    }) : null);
    if (existingMember) {
      this.removeMemberFromConversation(existingMember);
    } else {
      this.addMemberToConversation(this.state.organizationMembers.find((member) => { return member.id === id}));
    }
    this.triggerCancel();
  };

  triggerCancel = () => {
    this.setState({
      filter: '',
    });
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

  handleCloseView = () => {
    this.props.setConversationSettingsState('hide');
  };

  validate = () => {
    if (this.state.conversationTitle && this.state.conversationTitle.length > 0) {
      return true;
    }
    return false;
  };

  renderConversationMemberList = () => {
    return (
      this.state.conversationMembers.filter((member) => {
        return (member.presenceStatus === 'online');
      }).sortBy((member) => {
        return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
      }).concat(this.state.conversationMembers.filter((member) => {
        return (member.presenceStatus === 'offline');
      }).sortBy((member) => {
        return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
      })).map((conversationMember) => {
        return (
          <div key={conversationMember.id} className={styles.userLogoContainer}>
            <User key={conversationMember.id} user={conversationMember} showName={false}/>
            { (this.props.conversationSettingsViewState === 'create' && conversationMember.id === this.props.currentUser.id) ?
              '' : <div className={styles.action} onClick={this.triggerUpdate.bind(this, conversationMember.id)}>
                &times;
              </div> }
          </div>
        );
      })
    );
  };

  renderOrganizationMemberList = () => {
    return (
      this.filteredOptions(this.state.filter, this.state.organizationMembers.toList()).filter((member) => {
        return (member.presenceStatus === 'online');
      }).sortBy((member) => {
        return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
      }).concat(this.filteredOptions(this.state.filter, this.state.organizationMembers).filter((member) => {
        return (member.presenceStatus === 'offline');
      }).sortBy((member) => {
        return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
      })).map((user) => {
        const existingMember = (this.state.conversationMembers ? this.state.conversationMembers.find((member) => {
          return (member.id === user.id);
        }) : null);
        const selected = (existingMember ? true : false);
        return (
          <div key={user.id} className={styles.organizationMember}>
            { this.props.conversationSettingsViewState === 'create' && user.id === this.props.currentUser.id ?
                <SelectableUser key={user.id} user={user} selected={selected}/> :
                <SelectableUser key={user.id} user={user} selected={selected} onUpdate={this.triggerUpdate}/>
            }
          </div>);
      }, this)
    );
  };

  handleConversationTitleSave = (title) => {
    this.props.updateConversation(this.props.currentConversation.id, { title });
  };

  handleConversationTitleChange = (ev, value) => {
    this.setState({ conversationTitle: value });
  };

  saveConversationTitle = () => {
    if (this.validate()) {
      const conversationJson = {
        title: this.state.conversationTitle,
        organization_id: this.props.currentOrganization.id,
        conversation_members: this.state.conversationMembers,
      };
      const { conversationSettingsViewState } = this.props;
      if (conversationSettingsViewState === 'edit') {
        conversationJson.conversation_members = conversationJson.conversation_members.map((user) => {
          return ({
            conversation_id: this.props.currentConversation.id,
            member_id: user.id,
            email: user.email,
          });
        });
        this.props.updateConversation(this.props.currentConversation.id, conversationJson);
      } else if (conversationSettingsViewState === 'create') {
        this.props.createConversation(conversationJson);
      }

      this.handleCloseView();
    } else {
      alert('Conversation title cannot be blank');
    }
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
  }

  render()  {
    return (
      <div className={styles.root}>
        <div className={styles.conversationTitleContainer}>
          <Icon type="chat" contentClassName={styles.chatIcon}/>

          <div className={styles.conversationTitle}>
            <SizungInput ref="name" onChange={this.handleConversationTitleChange}
                            onKeyDown={this.handleKeyDown}
                            value={this.state.conversationTitle} rows="1"
                            placeholder="Enter Team name" maxLength={25}
            />
          </div>
          <div className={styles.charsHint}>15 chars</div>
        </div>
        <div className={styles.membersContainer}>
          <div className={styles.inviteMemberLabel}>
            INVITE TEAMMATES
          </div>
          <div className={styles.conversationMemberList}>
            {this.renderConversationMemberList()}
          </div>
          <div className={styles.memberSettingsContainer}>
            <div className={styles.inputContainer}>
              <input ref="memberFilter" type="text" className={styles.input} id="memberName"
                     placeholder="Search" onKeyDown={this.handleKeyDown}
                     onChange={this.handleFilterChange}
                  />
            </div>
            <div className={styles.organizationMembersContainer}>
              {this.renderOrganizationMemberList()}
            </div>
          </div>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.cancelButton} onClick={this.handleCloseView}>
            CANCEL
          </div>
          <div className={styles.actionButton} onClick={this.saveConversationTitle}>
            { this.props.conversationSettingsViewState === 'edit' ? 'SAVE' : 'CREATE' }
          </div>
        </div>
      </div>
    );
  }
}

ConversationSettings.propTypes = {
  organizationMembers: PropTypes.object,
  conversationMembers: PropTypes.object,
  conversationMembersAsUsers: PropTypes.object,
  currentConversation: PropTypes.object,
  conversationSettingsViewState: PropTypes.string.isRequired,
  updateConversation: PropTypes.func.isRequired,
  createConversation: PropTypes.func.isRequired,
  currentOrganization: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default ConversationSettings;
