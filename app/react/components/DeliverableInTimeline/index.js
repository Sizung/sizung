import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import Time from 'react-time';
import User from '../User/index';
import DeliverableIcon from '../DeliverableIcon';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions';

class DeliverableInTimeline extends React.Component {
  static propTypes = {
    deliverable: PropTypes.shape({
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      dueOn: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
    showOwner: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    showOwner: true,
  };

  lastUpdatedTime = () => {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.deliverable;
    if (archived) {
      return (<span><span>Archived&nbsp;</span><Time value={archivedAt} titleFormat="YYYY/MM/DD HH:mm" relative /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<Time value={updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative /></span>);
    }
    return <Time value={createdAt} titleFormat="YYYY/MM/DD HH:mm" relative />;
  };

  render() {
    const { deliverable, showOwner } = this.props;
    const { owner, dueOn } = deliverable;

    return (
      <div className={styles.root}>
        <div className={styles.userContainer}>
          { showOwner ? <User user={owner} size="large" /> : ''}
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.deliverableLabel}>DELIVERABLE created</div>
            <Link to={'deliverables/' + deliverable.id} className={styles.title}>
              <div className={styles.deliverableIconContainer}><DeliverableIcon /></div>
              <TextWithMentions>{deliverable.title}</TextWithMentions>
              { dueOn ? <small>{'Due on '}<Time value={dueOn} format="DD MMM - YYYY" /></small> : ''}
            </Link>
          </div>
          <small>
            {this.lastUpdatedTime()}
          </small>
        </div>
      </div>
    );
  }
}

export default DeliverableInTimeline;

