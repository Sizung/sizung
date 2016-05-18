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
  };

  renderAttachmentIcon = () => {
    const { fileName, fileUrl, fileType } = this.props.attachment;
    // Expecting fileType as mime type .. for example image/jpeg, image/png etc.
    console.log('fileType: ', fileType);
    if (fileType && fileType.indexOf('image') > -1) {
      return (
        <div className={styles.iconImage}>
          <img src={fileUrl} width='100%' height='100%'/>
        </div>
      );
    }
    return (
      <div className={styles.icon}>
        <a href={fileUrl} target="_blank" className={styles.extension}>
          {fileName.split('.')[1].toUpperCase()}
        </a>
      </div>
    );
  };

  renderShowAttachment = () => {
    const { fileName, fileSize, fileUrl } = this.props.attachment;
    return (
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer} onClick={this.downLoadAttachment}>
          {this.renderAttachmentIcon()}
          <div className={styles.detailsContainer}>
            <div className={styles.label}>
              ATTACHMENT
            </div>
            <a href={fileUrl} target="_blank" className={styles.fileName}>
              {fileName}
            </a>
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
    const { owner } = this.props.attachment;
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
    fileType: PropTypes.string,
    fileUrl: PropTypes.string.isRequired,
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
