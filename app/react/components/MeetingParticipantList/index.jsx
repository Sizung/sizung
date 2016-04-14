import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import User from './../User';
import SelectableUser from './../SelectableUser';
import styles from './index.css';
import Immutable from 'immutable';
import * as api from '../../utils/api';

class MeetingParticipantList extends React.Component {

  constructor() {
    super();

    this.state = {
      filter: '',
      isOpen: false,
    };

    this.meetingParticipants = new Immutable.List();
  }

  renderConversationMemberList = () => {
    if (this.props.conversationMembers !== null) {
      return (
          this.filteredOptions(this.state.filter, this.props.conversationMembers).filter((member) => {
            return (member.presenceStatus === 'online');
          }).sortBy((member) => {
            return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
          }).concat(this.filteredOptions(this.state.filter, this.props.conversationMembers).filter((member) => {
            return ( member.presenceStatus === 'offline');
          }).sortBy((member) => {
            return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
          })).map((user) => {
            const existingMember = this.meetingParticipants.find(function (member) {
              return (member.id === user.id);
            });
            return (
              <SelectableUser user={user} key={user.id}
                onUpdate={this.triggerUpdate}
                isSelected={existingMember ? true : false}
              />
            );
          }, this));
    }
    return null;
  };

  addParticipantToMeeting = (id) => {
    this.setState({ filter: '' });
    this.meetingParticipants = this.meetingParticipants.push(this.props.conversationMembers.find((member) => {
      return member.id === id;
    }));
  };

  removeParticipantFromMeeting = (id) => {
    this.setState({ filter: '' });
    this.meetingParticipants = this.meetingParticipants.filter((participant) => {
      return participant.id !== id;
    });
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  renderMeetingParticipantList = () => {
    if (this.meetingParticipants !== null) {
      return (
        this.meetingParticipants.filter((member) => {
          return (member.presenceStatus === 'online');
        }).sortBy((member) => {
          return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
        }).concat(this.meetingParticipants.filter((member) => {
          return ( member.presenceStatus === 'offline');
        }).sortBy((member) => {
          return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
        })).map((meetingParticipant) => {
          return (<User key={meetingParticipant.id} user={meetingParticipant} showName={false}
            style={{ display: 'inline-block', marginTop: '5px', marginBottom: '5px', marginRight: '5px' }}
          />);
        }, this)
      );
    }
    return '';
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleInputSubmit(event);
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  };

  triggerUpdate = (id) => {
    let existingMember = this.meetingParticipants.find(function (member) {
      return (member.id === id);
    });
    if (existingMember) {
      this.removeParticipantFromMeeting(existingMember.id);
    } else {
      this.addParticipantToMeeting(id);
    }
    this.triggerCancel();
  };

  triggerCancel = () => {
    this.setState({ filter: '' });
    this.refs.memberFilter.value = '';
  };

  handleInputSubmit = (event) => {
    event.preventDefault();
    const { filter } = this.state;

    const filteredOptions = this.filteredOptions(filter, this.props.conversationMembers);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  };

  filteredOptions = (filter, options) => {
    return options.filter(function (option) {
      return ((option.firstName + ' ' + option.lastName ).toLowerCase().indexOf(filter.toLowerCase()) > -1 || (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1 );
    });
  };

  sendMeetingRequest = () => {
    let memberIdList = new Immutable.List();
    this.meetingParticipants.map((participant) => {
      if (participant.id !== this.props.currentUser.id) {
        memberIdList = memberIdList.push({ id: participant.id });
      }
    }, this);
    api.postJson('/api/meetings', { memberIdList, url: window.location.href, parent: { id: this.props.parent.id, type: this.props.parent.type } }, (json) => {
      alert(json.message);
    });
  };


  handleToggleView = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  renderClosed = () => {
    return (
      <span className={styles.dropdownContainer}>
        <button onClick={ this.handleToggleView } className={styles.callMeetingButton} title='Ping'>
          <i className='fa fa-users'></i><span className='hidden-xs'> Ping</span>
        </button>
      </span>
    );
  };

  renderOpened = () => {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.root}>
          <div className={styles.fullWidthContainer}>
            <div className={styles.meetingParticipantTitle}>
              <h4>Meeting Participants</h4>
            </div>
            <a className={styles.closeButton} onClick={this.handleToggleView}><span aria-hidden="true">&times;</span></a>
          </div>
          <div className={styles.meetingParticipantList}>
            {this.renderMeetingParticipantList()}
            <button onClick={ this.sendMeetingRequest } className={styles.meetingInviteButton}>Ping</button>
          </div>
          <div className={styles.fullWidthContainer}>
            <div className={styles.conversationMemberTitle}>
              <h4>Conversation Members</h4>
            </div>
            <form>
              <div className={styles.inputContainer}>
                <input ref="memberFilter" type="text" className={styles.input} id="memberName"
                       placeholder="Filter by name, email" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange}
                    />
              </div>
            </form>
            <div className='row'>
            {this.renderConversationMemberList()}
            </div>
          </div>
        </div>
      </div>
    );
  };


  componentWillMount() {
    this.meetingParticipants = this.meetingParticipants.push(this.props.currentUser);
  }

  componentDidUpdate() {
    const inputElem = ReactDOM.findDOMNode(this.refs.memberFilter);
    if (inputElem) {
      inputElem.focus();
    }
  }

  render() {
    return this.state.isOpen ? this.renderOpened() : this.renderClosed();
  }
}

MeetingParticipantList.propTypes = {
  conversationMembers: PropTypes.object,
  currentConversation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default MeetingParticipantList;
