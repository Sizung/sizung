import React, { PropTypes } from 'react';
import User from './../User';
import SelectableUser from './../SelectableUser';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import Immutable from 'immutable';
import * as api from '../../utils/api';

@CSSModules(styles)
class MeetingParticipantList extends React.Component {

  constructor() {
    super();

    this.state = {
      filter: '',
      isMeetingParticipantListUpdated: false,
    };

    this.meetingParticipants = new Immutable.List();;
    
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.renderConversationMemberList = this.renderConversationMemberList.bind(this);
    this.renderMeetingParticipantList = this.renderMeetingParticipantList.bind(this);
    this.addParticipantToMeeting = this.addParticipantToMeeting.bind(this);
    this.removeParticipantFromMeeting = this.removeParticipantFromMeeting.bind(this);
    this.triggerCancel = this.triggerCancel.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.sendMeetingRequest = this.sendMeetingRequest.bind(this);

    this.handleClick = (e) => {
      e.preventDefault();
      $(e.currentTarget).find('.status').removeClass('fa-check-circle-o');
    };
  }

  addParticipantToMeeting(id) {
    this.setState({ isMeetingParticipantListUpdated : true, filter: '' });
    this.meetingParticipants = this.meetingParticipants.push(this.props.conversationMembers.find((member) => {
      return member.id === id;
    }));
  }

  removeParticipantFromMeeting(id) {
    this.setState({ isMeetingParticipantListUpdated : true, filter: '' });
    this.meetingParticipants = this.meetingParticipants.filter((participant) => {
      return participant.id !== id;
    });
  }

  componentWillMount() {
    this.meetingParticipants = this.meetingParticipants.push(this.props.currentUser);
  }

  componentDidUpdate() {
    const inputElem = this.refs.memberFilter;
    inputElem.focus();
    if (this.state.isMeetingParticipantListUpdated) {
      // TODO: Need to fix this. SetState should not be used in ComponentDidUpdate
      this.setState({ isMeetingParticipantListUpdated : false });
    }
  }

  handleFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  renderConversationMemberList() {
    if (this.props.conversationMembers !== null) {
      const _this = this;
      return (
          _this.filteredOptions(_this.state.filter, _this.props.conversationMembers).filter((member) => {
            return (member.presenceStatus === 'online');
          }).sortBy((member) => {
            return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
          }).concat(_this.filteredOptions(_this.state.filter, _this.props.conversationMembers).filter((member) => {
            return ( member.presenceStatus === 'offline');
          }).sortBy((member) => {
            return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
          })).map(function (user, i) {
            var existingMember = _this.meetingParticipants.find(function (member) {
              return (member.id === user.id);
            });
            const isSelected = (existingMember ? true : false);
            return (
                <SelectableUser user={user} key={user.id}
                                onUpdate={_this.triggerUpdate.bind(_this, user.id)}
                                isSelected={isSelected}
                />
            );
          }, this));
    }
    return null;
  }

  renderMeetingParticipantList() {
    if (this.meetingParticipants !== null) {
      const _this = this;
      return (
        _this.meetingParticipants.filter((member) => {
          return (member.presenceStatus === 'online');
        }).sortBy((member) => {
          return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
        }).concat(_this.meetingParticipants.filter((member) => {
          return ( member.presenceStatus === 'offline');
        }).sortBy((member) => {
          return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
        })).map((meetingParticipant) => {
          return (<User key={meetingParticipant.id} user={meetingParticipant} showName={false}
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
    let existingMember = this.meetingParticipants.find(function (member) {
      return (member.id === id);
    });
    console.log('Existing Member: ' + existingMember);
    if (existingMember) {
      this.removeParticipantFromMeeting(existingMember.id);
    } else {
      this.addParticipantToMeeting(id);
    }
    this.triggerCancel();
  }

  triggerCancel() {
    this.state = {
      filter: '',
    };
    this.refs.memberFilter.value = '';
  }

  handleInputSubmit(event) {
    event.preventDefault();
    const { filter } = this.state;

    const filteredOptions = this.filteredOptions(filter, this.props.conversationMembers);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  filteredOptions(filter, options) {
    return options.filter(function (option) {
      return ((option.firstName + ' ' + option.lastName ).toLowerCase().indexOf(filter.toLowerCase()) > -1 || (option.email).toLowerCase().indexOf(filter.toLowerCase()) > -1 );
    });
  }

  sendMeetingRequest() {
    let memberIdList = new Immutable.List();
    this.meetingParticipants.map((participant) => {
      memberIdList = memberIdList.push({ id: participant.id });
    });
    const _this = this;
    api.postJson('/meetings/create', { sender: _this.props.currentUser, memberIdList, url: window.location.href }, (json) => {
      alert('Meeting Invite Sent Successfully!');
    });
  };

  render() {
    console.log("Rendering Meeting Participant List: " + JSON.stringify(this.meetingParticipants));
    return (
        <div styleName='root'>
          <div styleName='full-width-container'>
            <div styleName='conversation-member-title'>
              <h4>Meeting Participants</h4>
            </div>
            <a styleName='close-button' onClick={this.props.toggleMeetingParticipantsView}><span aria-hidden="true">&times;</span></a>
          </div>
          <div styleName='full-width-container'>
            {this.renderMeetingParticipantList()}
            <button onClick={ this.sendMeetingRequest }className='btn btn-xs btn-success pull-right' style={{ margin: '10px' }}>Invite</button>
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
                <h4>Conversation Members</h4>
              </div>
            </div>
            {this.renderConversationMemberList()}
          </div>
        </div>

    );
  }
}

MeetingParticipantList.propTypes = {
  conversationMembers: PropTypes.object.isRequired,
  toggleMeetingParticipantsView: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default MeetingParticipantList;
