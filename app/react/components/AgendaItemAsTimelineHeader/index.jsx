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
          <Icon type="agendaItem">
            <TextWithMentions maxLength={40}>{title}</TextWithMentions>
          </Icon>
        </div>
        <div className={styles.closeLinkContainer}>
          <Link to={'/conversations/' + agendaItem.conversationId} className={styles.close}>Back to Chat</Link>
        </div>
      </div>
    );
  }
}

export default AgendaItemAsTimelineHeader;
