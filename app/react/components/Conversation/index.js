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

@CSSModules(styles)
class Conversation extends React.Component {

  static renderUnseenBadge(count, selected) {
    if (!selected && count && count > 0) {
      return <UnseenBadge count={count} />;
    }
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
  }).isRequired,
  visitConversation: PropTypes.number.isRequired,
};

export default Conversation;
