import React, { Component, PropTypes } from 'react';
import AgendaItem from './AgendaItem';

class AgendaItemList extends Component {
  render() {
    const { agendaItems } = this.props;

    return (
      <div className='agendaItemList'>
        {
          agendaItems.map(function(agendaItem) {
            return(<AgendaItem
                    key={agendaItem.id}
                    title={agendaItem.title}
                    conversationTitle={agendaItem.conversationTitle}
                    commentsSize={agendaItem.commentsSize}
                />);
          })
        }
      </div>
    );
  }
}

AgendaItemList.propTypes = {
  agendaItems: PropTypes.array.isRequired
};

export default AgendaItemList;
