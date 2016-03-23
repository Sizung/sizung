import React, { PropTypes } from 'react';
import Icon from '../Icon';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions/index';
import { Link } from 'react-router';

class DeliverableInTimelineHeader extends React.Component {

  static propTypes = {
    deliverable: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { deliverable } = this.props;
    const { title } = deliverable;

    return (
      <div className={ styles.root }>
        <div className={ styles.titleContainer }>
          <Icon type="deliverable" gap="2rem" />
          <TextWithMentions>{title}</TextWithMentions>
        </div>
        <div className={styles.closeLinkContainer}>
          <Link to={'/agenda_items/' + deliverable.agendaItemId} className={styles.close}>Back to Agenda Item</Link>
        </div>
      </div>
    );
  }
}

export default DeliverableInTimelineHeader;
