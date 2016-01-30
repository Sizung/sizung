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
    conversation.members.map((member) => {
      const filteredUsers = users.filter((user) => {
        return user.id === member.id;
      });
      if (filteredUsers !== null && filteredUsers.size === 1) {
        conversationMembersDOM.push(<User user={ filteredUsers.get(0) } showName={ false } size={'small'} style={{ marginRight: '2px', marginBottom: '2px'}}/>);
      }
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
