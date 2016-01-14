import React from 'react';

import ConversationObjectList from '../../components/ConversationObjectList';
import ConversationLayoutApp from '../../containers/ConversationLayoutApp';

import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles)
class ConversationView extends React.Component {
  render() {
    const { conversationObjectsList, currentConversation, conversationMembers } = this.props;
    if (conversationObjectsList.conversationObjects) {
      return (
        <ConversationLayoutApp>
          <ConversationObjectList
            {...this.props}
            {...conversationObjectsList}
            currentConversation={currentConversation}
            conversationMembers={conversationMembers}
            styleName="root"
          />
        </ConversationLayoutApp>
      );
    }

    return <div className="text-center"><h5>Loading...</h5></div>;
  }
}

export default ConversationView;
