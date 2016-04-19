import React, { PropTypes } from 'react';
import PlusIcon from '../PlusIcon';

class CreateConversation extends React.Component {

  handleClick = () => {
    this.props.setConversationSettingsState('create');
  };

  render = () => {
    return (
      <a onClick={this.handleClick}>
        <PlusIcon />
      </a>
    );
  };
}

CreateConversation.propTypes = {
  setConversationSettingsState: PropTypes.func,
};

export default CreateConversation;
