// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './index.css';
import EditableText from '../EditableText';
import User from '../User';
import Immutable from 'immutable';

class Conversation extends React.Component {

  renderConversationMembers = () => {
    const { conversation, users } = this.props;
    const conversationMembersDOM = [];
    let conversationMembers = new Immutable.List();
    conversation.members.map((member) => {
      const filteredUsers = users.filter((user) => {
        return user.id === member.id;
      });
      if (filteredUsers !== null && filteredUsers.size === 1) {
        conversationMembers = conversationMembers.push(filteredUsers.get(0));
      }
    });
    conversationMembers.filter((member) => {
      return (member.presenceStatus === 'online');
    }).sortBy((member) => {
      return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
    }).concat(conversationMembers.filter((member) => {
      return ( member.presenceStatus === 'offline');
    }).sortBy((member) => {
      return member.name === null ? member.email.toLowerCase() : member.name.toLowerCase();
    })).map((member) => {
      conversationMembersDOM.push(<div className={styles.memberContainer}><User user={ member } showName={ false }/></div>);
    });
    return conversationMembersDOM;
  }

  render() {
    const { conversation } = this.props;
    return (
      <div className={conversation.unseenCount > 0 ? styles.unseen : styles.seen}>
        <div className={styles.contentContainer}>
          <Link to={'/conversations/' + conversation.id}>
            <div className={styles.title}>{ '#' + (conversation.title.length > 40 ? conversation.title.substr(0, 40) + '...' : conversation.title) }</div>
          </Link>
          <div className={styles.actions}>
            <a href={'/conversations/' + conversation.id + '/edit'} className={styles.action}>
              <i className="fa fa-pencil" /> edit
            </a>
            <a href={'/conversations/' + conversation.id} className={styles.action} data-confirm="Are you sure?" rel="nofollow" data-method="delete">
              <i className="fa fa-trash-o"></i> delete
            </a>
          </div>
        </div>
        <div className={styles.conversationMembersContainer}>
          {this.renderConversationMembers()}
        </div>
      </div>
    );
  }
}

Conversation.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    unseenCount: PropTypes.number.isRequired,
    members: PropTypes.array.isRequired,
  }).isRequired,
  users: PropTypes.object.isRequired,
};

export default Conversation;
