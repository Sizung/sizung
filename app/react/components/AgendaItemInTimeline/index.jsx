import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SizungTime from '../SizungTime';
import User from '../User/index';
import Icon from '../Icon';
import styles from './index.css';
import TextWithMentions from '../TextWithMentions';

class AgendaItemInTimeline extends React.Component {
  lastUpdatedTime = () => {
    const { archived, createdAt, updatedAt, archivedAt } = this.props.agendaItem;
    if (archived) {
      return (<span><span >Archived&nbsp;</span><SizungTime value={archivedAt} /></span>);
    } else if (createdAt !== updatedAt) {
      return (<span>Edited&nbsp;<SizungTime value={updatedAt} /></span>);
    }
    return <SizungTime value={createdAt} />;
  };

  render() {
    const { agendaItem, showOwner } = this.props;
    const { owner } = agendaItem;
    return (
        <div className={styles.root}>
          <div className={styles.userContainer}>
            { showOwner ? <User user={owner}/> : ''}
          </div>
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <Link to={'/agenda_items/' + agendaItem.id} className={styles.title}>
                <div className={styles.textContainer}>
                  <Icon type="agendaItem" className={styles.icon} gap={'0.5rem'}/>
                  <TextWithMentions>{agendaItem.title}</TextWithMentions>
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

AgendaItemInTimeline.propTypes = {
  agendaItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  updateAgendaItem: PropTypes.func.isRequired,
  visitAgendaItem: PropTypes.func.isRequired,
  showOwner: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

AgendaItemInTimeline.defaultProps = {
  showOwner: true,
};
export default AgendaItemInTimeline;
