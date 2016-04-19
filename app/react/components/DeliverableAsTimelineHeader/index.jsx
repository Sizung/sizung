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

  renderBackLink = (deliverable) => {
    if (deliverable.parentType === 'agendaItems') {
      return <Link to={'/agenda_items/' + deliverable.parentId} className={styles.close}>Back to Agenda Item</Link>
    }

    return <Link to={'/conversations/' + deliverable.parentId} className={styles.close}>Back to Conversation</Link>
  }
  
  render() {
    const { deliverable } = this.props;
    const { title } = deliverable;

    return (
      <div className={ styles.root }>
        <div className={ styles.titleContainer }>
          <Icon className={ styles.icon } type="deliverable" gap="1.5rem" />
          <TextWithMentions>{title}</TextWithMentions>
        </div>
        <div className={styles.closeLinkContainer}>
          { this.renderBackLink(deliverable) }
        </div>
      </div>
    );
  }
}

export default DeliverableInTimelineHeader;
