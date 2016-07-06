import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './ConversationSettings.css';
import Immutable from 'immutable';
import SizungInput from '../SizungInput';
import Icon from '../Icon';
import { validateEmail } from '../../utils/validators';
import classNames from 'classnames';

class ConversationSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      inviteEmail: undefined,
      emailInputError: false,
      conversationTitle: props.conversationSettingsViewState === 'edit' ? props.currentConversation.title : '',
      conversationMembers: props.conversationSettingsViewState === 'edit' ? props.conversationMembersAsUsers : (new Immutable.List()).push(props.currentUser),
      invitedMembersEmailList: new Immutable.List(),
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

  handleEmailChange = (event) => {
    this.setState({ inviteEmail: event.target.value });
  };

  handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  };

  handleInviteByEmailKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.inviteByEmail();
    }
  };

  inviteByEmail = () => {
    const { inviteEmail } = this.state;
    const { currentOrganization } = this.props;
    if (validateEmail(inviteEmail)) {
      this.props.inviteOrganizationMember(
        currentOrganization && currentOrganization.id,
        inviteEmail
      );
      this.setState({
        inviteEmail: undefined,
        emailInputError: false,
        invitedMembersEmailList: this.state.invitedMembersEmailList.push(this.state.inviteEmail),
      });
    } else {
      this.setState({
        emailInputError: true,
      });
    }
  }

  triggerUpdate = (id) => {
    const existingMember = (this.state.conversationMembers ? this.state.conversationMembers.find((member) => {
      return (member.id === id);
    }) : null);
    if (existingMember) {
      this.removeMemberFromConversation(existingMember);
    } else {
      this.addMemberToConversation(this.props.organizationMembers.find((member) => { return member.id === id}));
    }
    this.triggerCancel();
  };

  triggerCancel = () => {
    this.setState({
      filter: '',
    });
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

  filterNonConversationalOrgMembers = (member) => {
    const { conversationMembers } = this.state;
    return !conversationMembers.some((conMember) => {
      return (conMember.name !== null && conMember.name === member.name) || conMember.email === member.email;
    });
  };

  renderOrganizationMemberList = () => {
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
  };

  handleKeyDown = (event) => {
    event.stopPropagation();
  };

  componentWillReceiveProps(nextProps) {
    const invitedMembers = nextProps.organizationMembers.filter((member) => {
      return this.state.invitedMembersEmailList.some((invitedMemberEmail) => {
        return invitedMemberEmail.toLowerCase() === member.email.toLowerCase();
      });
    });
    this.setState({
      conversationMembers: this.state.conversationMembers.concat(invitedMembers),
      invitedMembersEmailList: new Immutable.List(),
    });
  }

  render()  {
    const { filter, inviteEmail, emailInputError } = this.state;
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
          <div className={styles.inviteTeammateLabel}>
            MEMBERS
          </div>
          <div className={styles.conversationMemberList}>
            {this.renderConversationMemberList()}
          </div>
          <div className={styles.inviteMemberContainer}>
            <div className={styles.inviteMemberLabel}>
              INVITE NEW MEMBERS
            </div>
            <div>
              <input
                type="text"
                className={classNames(styles.inviteMemberInput, {
                  [`${styles.inviteMemberInputInvalid}`]: emailInputError,
                })}
                id="inviteEmail"
                value={inviteEmail}
                onChange={this.handleEmailChange}
                placeholder="Invite members by email"
                onKeyDown={this.handleInviteByEmailKeyDown}
              />
              <span
                onClick={this.inviteByEmail}
                className={styles.memberInviteLink}
              >
                Invite
              </span>
            </div>
          </div>

          <div className={styles.memberSettingsContainer}>
            <div className={styles.inputContainer}>
              <input ref="memberFilter" type="text" className={styles.input} id="memberName"
                     placeholder="Search or add by selecting" onKeyDown={this.handleKeyDown}
                     onChange={this.handleFilterChange} value={filter}
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
            { this.props.conversationSettingsViewState === 'edit' ? 'CONFIRM' : 'CREATE' }
          </div>
        </div>
      </div>
    );
  }
}

ConversationSettings.propTypes = {
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
