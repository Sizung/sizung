import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SizungTime from '../SizungTime';
import Time from 'react-time';
import User from '../User/index';
import Icon from '../Icon';
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
      return (<span><span>Archived&nbsp;</span><SizungTime value={archivedAt} /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<SizungTime value={updatedAt} /></span>);
    }
    return <SizungTime value={createdAt} />;
  };

  dueOn = () => {
    if (this.props.deliverable.dueOn) {
      return (
        <div className={styles.dueOnWrapper}>
          <div className={styles.dueOnLabel}>{'DUE ON'}</div>
          <div className={styles.dueDateContainer}>
            <Time value={this.props.deliverable.dueOn} format="DD MMM - YYYY" />
          </div>
        </div>
      );
    }
  };

  render() {
    const { deliverable, showOwner } = this.props;
    const { owner } = deliverable;

    return (
      <div className={styles.root}>
        <div className={styles.userContainer}>
          { showOwner ? <User user={owner} /> : ''}
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.deliverableLabel}>DELIVERABLE created</div>
            <Link to={'deliverables/' + deliverable.id} className={styles.title}>
              <div className={styles.row}>
                <div className={styles.textContainer}>
                  <Icon className={styles.icon} type="deliverable" gap="1.5rem" />
                  <TextWithMentions>{deliverable.title}</TextWithMentions>
                </div>
              </div>
              <div className={styles.properties}>
                <div style={{ flex: 'none' }}>
                  <User user={deliverable.assignee} />
                </div>
                {this.dueOn()}
              </div>
            </Link>
          </div>
          <div className={styles.timeContainer}>
            {this.lastUpdatedTime()}
          </div>
        </div>
      </div>
    );
  }
}

export default DeliverableInTimeline;

