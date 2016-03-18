import React, { PropTypes } from 'react';
import AgendaItemIcon from '../AgendaItemIcon';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions/index';
import { Link } from 'react-router';

class AgendaItemAsTimelineHeader extends React.Component {

  static propTypes = {
    agendaItem: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { agendaItem } = this.props;
    const { title } = agendaItem;

    return (
      <div className={ styles.root }>
        <div className={ styles.agendaItemIconContainer }>
          <AgendaItemIcon inverted size={'large'}/>
        </div>
        <div className={ styles.titleContainer }>
          <TextWithMentions maxLength={40}>{title}</TextWithMentions>
        </div>
        <div className={styles.closeLinkContainer}>
          <Link to={'/conversations/' + agendaItem.conversationId} className={styles.close}>Back to Chat</Link>
        </div>
      </div>
    );
  }
}

export default AgendaItemAsTimelineHeader;
