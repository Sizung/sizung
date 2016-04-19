import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './ConversationSettings.css';
import Immutable from 'immutable';
import UserIcon from '../UserIcon';
import CloseIcon from '../CloseIcon';
import EditableText from '../EditableText';
import SizungInputApp from '../../containers/SizungInputApp';
import Icon from '../Icon';

class ConversationSettings extends React.Component {
  constructor() {
    super();

    this.state = {
      filter: '',
      conversationTitle: '',
      conversationMembers: new Immutable.List(),
      organizationMembers: new Immutable.List(),
    };
  }

  handleClick = (e) => {
    e.preventDefault();
    $(e.currentTarget).find('.status').removeClass('fa-check-circle-o');
  };

  addMemberToConversation = (id) => {
    this.setState({ filter: '' });
    this.props.createConversationMember(this.props.currentConversation.id, id);
    //this.state.conversationMembers = this.state.conversationMembers.push(id);
  };

  removeMemberFromConversation = (id) => {
    this.setState({ filter: '' });
    this.props.deleteConversationMember(id);
    //this.state.conversationMembers = this.state.conversationMembers.pop(id);
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

  handleCloseView = () => {
    this.props.setConversationSettingsState('hide');
  };

  renderConversationSettings = () => {
    if (this.props.conversationMembers) {
      let conversationMembersAsUsers = new Immutable.List();
      this.props.conversationMembers.toList().map((user) => {
        this.props.organizationMembers.forEach((obj) => {
          if (obj.id === user.memberId) {
            obj.conversationMemberId = user.id;
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
          return (
            <div className={styles.userLogoContainer}>
              <User key={conversationMember.id} user={conversationMember} showName={false}/>
              <div className={styles.action} onClick={this.removeMemberFromConversation.bind(this, conversationMember.conversationMemberId)}>
                &times;
              </div>
            </div>
              );
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

  handleConversationTitleUpdate = (title) => {
    this.props.updateConversation(this.props.currentConversation.id, { title });
  };

  handleConversationTitleChange = (ev, value) => {
    this.setState({ conversationTitle: value });
  };

  saveConversationTitle = () => {
    const newConversation = {
      title: this.state.conversationTitle,
      organization_id: this.props.currentOrganization.id,
    };
    this.props.createConversation(newConversation);
    this.handleCloseView();
  }

  updateConversation = () => {

  }

  renderCreate = () => {
    if (this.props.organizationMembers) {
      return (
          <div className={styles.root}>
            <div className={styles.conversationTitleContainer}>
              <Icon type="chat" contentClassName={styles.chatIcon}/>

              <div className={styles.conversationTitle}>
                <SizungInputApp ref="name" onChange={this.handleConversationTitleChange}
                                onSubmit={this.saveConversationTitle} value={this.state.conversationTitle} rows="1"
                                placeholder="Enter Conversation name" maxLength={15}/>
              </div>
              <div className={styles.charsHint}>15 chars</div>
            </div>
            <div className={styles.actionContainer}>
              <div className={styles.cancelButton} onClick={this.handleCloseView}>
                CANCEL
              </div>
              <div className={styles.actionButton} onClick={this.saveConversationTitle}>
                CREATE
              </div>
            </div>
          </div>
      );
    }
  };

  renderEdit = () => {
    const { currentConversation } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.conversationTitleContainer}>
          <Icon type="chat" contentClassName={styles.chatIcon}/>
          <div className={styles.conversationTitle}>
            <EditableText text={currentConversation.title} onUpdate={this.handleConversationTitleUpdate} maxLength={40}/>
          </div>
          <div className={styles.charsHint}>15 chars</div>
        </div>
        <div className={styles.inviteMemberLabel}>
          INVITE TEAMMATES
        </div>
        <div className={styles.conversationMemberList}>
          {this.renderConversationSettings()}
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
        <div className={styles.actionContainer}>
          <div className={styles.cancelButton} onClick={this.handleCloseView}>
            CANCEL
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (this.props.conversationSettingsViewState === 'edit') {
      return this.renderEdit();
    } else if (this.props.conversationSettingsViewState === 'create') {
      return this.renderCreate();
    }
    return null;
  }
}

ConversationSettings.propTypes = {
  organizationMembers: PropTypes.object,
  conversationMembers: PropTypes.object,
  createConversationMember: PropTypes.func.isRequired,
  deleteConversationMember: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired,
  conversationSettingsViewState: PropTypes.string.isRequired,
  updateConversation: PropTypes.func.isRequired,
  currentOrganization: PropTypes.object.isRequired,
};

export default ConversationSettings;
