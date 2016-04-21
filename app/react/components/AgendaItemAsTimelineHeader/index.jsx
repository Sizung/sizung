import React, { PropTypes } from 'react';
import Icon from '../Icon';
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
        <div className={ styles.titleContainer }>
          <Icon className={ styles.icon } type="agendaItem" gap="2rem"/>
          <TextWithMentions>{title}</TextWithMentions>
        </div>
        <div className={styles.closeLinkContainer}>
          <Link to={'/conversations/' + agendaItem.conversationId} className={styles.close}>Back to Conversation</Link>
        </div>
      </div>
    );
  }
}

export default AgendaItemAsTimelineHeader;
