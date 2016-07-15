import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SizungTime from '../SizungTime';
import Time from 'react-time';
import UserApp from '../../containers/UserApp';
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
    showTimeStamp: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    showOwner: true,
    showTimeStamp: true,
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

  handleKeyDown = (event) => {
    event.stopPropagation();
  };

  dueOn = () => {
    if (this.props.deliverable.dueOn) {
      return (
        <div className={styles.dueOnWrapper}>
          <div className={styles.dueOnLabel}>{'DUE ON'}</div>
          <div className={styles.dueDateContainer} onKeyDown={this.handleKeyDown}>
            <Time value={this.props.deliverable.dueOn} format="DD MMM - YYYY" />
          </div>
        </div>
      );
    }
  };

  renderTime = () => {
    if (this.props.showTimeStamp) {
      return (
          <div className={styles.timeContainer}>
            {this.lastUpdatedTime()}
          </div>
      );
    }
    return null;
  };

  renderTitle = () => {
    const { deliverable } = this.props;
    return (
      <div className={styles.row}>
        <div className={styles.textContainer}>
          <Icon className={styles.icon} type="deliverable" gap="0.5rem" />
          <TextWithMentions>{deliverable.title}</TextWithMentions>
        </div>
      </div>
    );
  };

  renderContent = () => {
    const { deliverable } = this.props;
    if (deliverable.archived) {
      return (
        <div to={'/deliverables/' + deliverable.id} className={styles.title}>
          {this.renderTitle()}
        </div>
      );
    }
    return (
      <Link to={'/deliverables/' + deliverable.id} className={styles.title}>
        {this.renderTitle()}
      </Link>
    );
  };

  render() {
    const { deliverable, showOwner } = this.props;
    const { owner } = deliverable;

    return (
      <div className={ styles.root }>
        <div className={styles.userContainer}>
          { showOwner ? <UserApp user={owner} /> : ''}
        </div>
        <div className={ deliverable.archived ? styles.contentWrapperArchived : styles.contentWrapper }>
          <div className={styles.content}>
            {this.renderContent()}
          </div>
          {this.renderTime()}
        </div>
      </div>
    );
  }
}

export default DeliverableInTimeline;
