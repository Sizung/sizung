import React, { Component, PropTypes } from 'react';
import AgendaItem from './AgendaItem';
import { Glyphicon } from 'react-bootstrap';


class AgendaItemList extends Component {
  render() {
    const { agendaItems } = this.props;

    return (
      <div className='agendaItemList'>
        <div className='agendaItemListHeader padding-sm-vertical'>
          <i className="fa fa-tag"></i>  {" "}Agendas
        </div>
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
  agendaItems: PropTypes.object.isRequired
};

export default AgendaItemList;
