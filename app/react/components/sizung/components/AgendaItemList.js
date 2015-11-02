import React, { Component, PropTypes } from 'react';
import AgendaItem from './AgendaItem';
import { Glyphicon } from 'react-bootstrap';


class AgendaItemList extends Component {
  render() {
    const { agendaItems } = this.props;

    return (
      <div className='agendaItemList'>
        <div className='row agendaItemListHeader padding-sm box-shadow'>
          <i className="fa fa-tag"></i>  {" "}<strong>Agendas</strong>
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
