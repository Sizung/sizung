import React, { PropTypes } from 'react';
import SizungTime from '../SizungTime';
import User from './../User/index';
import styles from './Attachment.css';
import SizungInputApp from '../../containers/SizungInputApp';

class Attachment extends React.Component {
  lastUpdatedTime = () => {
    const { createdAt, updatedAt } = this.props.attachment;
    const lastUpdatedAt = (createdAt !== updatedAt ? updatedAt : createdAt);

    const editedIndicator = (createdAt !== updatedAt ? 'Edited ' : '');
    return (<div className={styles.timeContainer}>
      {editedIndicator}<SizungTime value={lastUpdatedAt} />
    </div>);
  };

  formatSize = (size) => {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB'][i];
  };

  downLoadAttachment = () => {
    console.log('Call download Api');
  }

  renderShowAttachment = () => {
    const { fileName, fileSize } = this.props.attachment;
    console.log('attachment: ' + JSON.stringify(this.props.attachment));
    return (
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer} onClick={this.downLoadAttachment}>
          <div className={styles.icon}>
            <div className={styles.extension}>
              {fileName.split('.')[1].toUpperCase()}
            </div>
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.label}>
              ATTACHMENT
            </div>
            <div className={styles.fileName}>
              {fileName}
            </div>
            <div className={styles.size}>
              {this.formatSize(parseInt(fileSize, 10))}
            </div>
          </div>
        </div>
        {this.lastUpdatedTime()}
      </div>
    );
  };

  render() {
    const { owner, fileName } = this.props.attachment;
    return (
      <div className={styles.root}>
        <div className={styles.userContainer}>
          { this.props.showOwner ? <User user={owner} /> : ''}
        </div>
        { this.renderShowAttachment() }
      </div>
    );
  }
}

Attachment.propTypes = {
  attachment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    owner: PropTypes.object,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  showOwner: PropTypes.bool.isRequired,
};

Attachment.defaultProps = {
  showOwner: true,
};


export default Attachment;
