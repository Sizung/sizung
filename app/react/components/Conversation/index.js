// Plain components should not have any knowledge of where the data came from and how to change the the state.

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from './index.css';

import EditableText from '../EditableText';
import EditableStatus from '../EditableStatus';
import UnseenBadge from '../UnseenBadge';
import CommentsCounter from '../CommentsCounter';
import DeliverablesCounter from '../DeliverablesCounter';
import User from '../User';
import Immutable from 'immutable';

@CSSModules(styles)
class Conversation extends React.Component {

  constructor() {
    super();
    this.renderConversationMembers = this.renderConversationMembers.bind(this);
  }

  static renderUnseenBadge(count, selected) {
    if (!selected && count && count > 0) {
      return <UnseenBadge count={count} />;
    }
  }

  renderConversationMembers() {
    const { conversation, visitConversation, users } = this.props;
    let conversationMembersDOM = [];
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
      conversationMembersDOM.push(<div styleName='member-container'><User user={ member } showName={ false } size={'small'}/></div>);
    });
    return conversationMembersDOM;
  }

  render() {
    const { conversation, visitConversation } = this.props;

    return (
      <div styleName="root">
        {Conversation.renderUnseenBadge(conversation.unseenCount, false)}
        <div styleName="default" onClick={visitConversation}>
          <div styleName="row">
            <div styleName="content-container">
              <Link to={'/conversations/' + conversation.id}>
                { conversation.title }
              </Link>
              <div styleName="actions">
                <small>
                  <a href={'/conversations/' + conversation.id + '/edit'} styleName="action">
                    <i className="fa fa-pencil" /> edit
                  </a>
                  <a href={'/conversations/' + conversation.id} styleName="action" data-confirm="Are you sure?" rel="nofollow" data-method="delete">
                    <i className="fa fa-trash-o"></i> delete
                  </a>
                </small>
              </div>
            </div>
            <div className='row zero-padding zero-margin'>
              {this.renderConversationMembers()}
            </div>
          </div>
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
  users: PropTypes.object.isRequired
};

export default Conversation;