import React, { PropTypes } from 'react';
import SizungTime from '../SizungTime';
import User from './../User/index';
import styles from './Attachment.css';
import OptionsDropdown from '../OptionsDropdown/index';

class Attachment extends React.Component {

  constructor(props) {
    super(props);

    this.dropDownOptions = [{
      label: 'Delete Attachment',
      function: this.handleDeleteClick,
    }];
  }

  handleDeleteClick = (e) => {
    e.preventDefault();
    this.props.archiveAttachment(this.props.attachment.id);
  };

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
    if (fileType && fileType.indexOf('image') > -1) {
      return (
        <a href={fileUrl} target="_blank" className={styles.thumbnailContainer}>
          <img src={fileUrl} className={styles.thumbnail}/>
        </a>
      );
    }
    return (
      <a href={fileUrl} target="_blank" className={styles.icon}>
        <span className={styles.extension}>
          {fileName.split('.').pop().toUpperCase()}
        </span>
      </a>
    );
  };

  renderShowAttachment = () => {
    const { fileName, fileSize, fileUrl } = this.props.attachment;
    return (
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer} onClick={this.downLoadAttachment}>
          {this.renderAttachmentIcon()}
          <a href={fileUrl} target="_blank" className={styles.detailsContainer}>
            <div className={styles.label}>
              ATTACHMENT
            </div>
            <div className={styles.fileName}>
              {fileName.length > 30 ? fileName.substr(0,30) + '...' + fileName.split('.').pop() : fileName }
            </div>
            <div className={styles.size}>
              {this.formatSize(parseInt(fileSize, 10))}
            </div>
          </a>
        </div>
        { this.props.showTimeStamp ? this.lastUpdatedTime() : null}
      </div>
    );
  };

  renderCommentSettingsOptions = (owner) => {
    const { currentUser } = this.props;

    if (currentUser.id === owner.id) {
      return (
        <div className={styles.optionsMenu}>
          <OptionsDropdown options={this.dropDownOptions} />
        </div>
      );
    }
  }

  render() {
    const { owner } = this.props.attachment;
    return (
      <div className={styles.root}>
        <div className={styles.userContainer}>
          { this.props.showOwner ? <User user={owner} /> : ''}
        </div>
        { this.renderShowAttachment() }
        { this.renderCommentSettingsOptions(owner) }
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
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  showTimeStamp: PropTypes.bool.isRequired,
  archiveAttachment: PropTypes.func.isRequired,
};

Attachment.defaultProps = {
  showOwner: true,
  showTimeStamp: true,
};


export default Attachment;
