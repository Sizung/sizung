import React, { PropTypes } from 'react';
import styles from './CommentComposer.css';
import UserApp from '../../containers/UserApp';
import ReactS3Uploader from 'react-s3-uploader';
import Icon from '../Icon';
import ComposerApp from '../../containers/ComposerApp';

class CommentComposer extends React.Component {
  static propTypes = {
    createComment: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
    createAttachment: PropTypes.func.isRequired,
    scrollListToBottom: PropTypes.func,
    entityId: PropTypes.string,
    labels: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.state = {
      editorContent: undefined,
      uploadStatus: '',
      uploadPercentage: 0,
      open: false,
    };

    this.handleSubmit = (text) => {
      this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: text });
    };
  }

  onUploadProgress = (data) => {
    this.setState({ uploadStatus: 'InProgress', uploadPercentage: data });
  };

  onUploadError = (data) => {
    this.setState({ uploadStatus: 'Error' });
  };

  onUploadFinish = (data) => {
    const fileInput = ReactDOM.findDOMNode(this.refs.input);
    const fileObject = fileInput.files[0];
    this.setState({ uploadStatus: '' });
    const { parent } = this.props;
    const fileName = data.signedUrl.split('?')[0].split('/').pop();
    const decodedFileName = decodeURIComponent(fileName);
    const persistentFileId = data.signedUrl.replace(fileName, decodedFileName)
    this.props.createAttachment(parent.type, parent.id, { persistent_file_id: persistentFileId, file_name: decodedFileName, file_size: fileObject.size, file_type: fileObject.type });
    fileInput.value = '';
  };

  handleChangeInMentionBox = (editorContent) => {
    this.setState({ editorContent });
  };

  handleSelect = (selectedType) => {
    const plainText = this.state.editorContent && this.state.editorContent.getPlainText();
    this.props.onSelect(selectedType, plainText && plainText.trim());
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  selectAgendaItem = () => {
    this.handleSelect('agendaItem');
  };

  selectDeliverable = () => {
    this.handleSelect('deliverable');
  };

  renderAgendaItem = () => {
    return <div className={styles.option} onClick={this.selectAgendaItem}><Icon type="agendaItem" className={styles.icon}>{this.props.labels.agendaItemLabel}</Icon></div>;
  };

  renderDeliverable = () => {
    return <div className={styles.option} onClick={this.selectDeliverable}><Icon type="deliverable" className={styles.icon} gap='0.5rem'>{this.props.labels.deliverableLabel}</Icon></div>;
  };

  renderCaret = (type) => {
    if (type === 'up') {
      return <div className={styles.caretUp} onClick={this.handleOpen}></div>;
    }
    return <div className={styles.caretDown} onClick={this.handleClose}></div>;
  };

  renderFileUploader = () => {
    const { parent } = this.props;
    const headers = [];
    const queryParams = [];
    const signingUrl = `/api/${parent.type === 'agendaItems' ? 'agenda_items' : parent.type}/${parent.id}/attachments/new`;
    return (
        <div className={styles.upload}>
          <div className={ this.state.uploadStatus === '' ? '' : styles['upload' + this.state.uploadStatus] }>
          </div>
          <ReactS3Uploader
              ref="input"
              signingUrl={signingUrl}
              accept="*/*"
              onProgress={this.onUploadProgress}
              onError={this.onUploadError}
              onFinish={this.onUploadFinish}
              signingUrlHeaders={{ additional: headers }}
              signingUrlQueryParams={{ additional: queryParams }}
              uploadRequestHeaders={{ 'x-amz-acl': 'private' }}
          />
        </div>
    );
  };

  renderCompositionOptionsButton = () => {
    return (
      <div className={styles.optionsButton} onClick={ this.state.open ? this.handleClose : this.handleOpen }>
        <div className={styles.separator}></div>
        <div className={styles.caretContainer}>
          {this.renderCaret(this.state.open ? 'down' : 'up')}
        </div>
      </div>
    );
  };

  renderCommentCompositionBox = () => {
    return (
      <div className={styles.rootClosed}>
        <div className={styles.user}>
          <UserApp user={this.props.currentUser} />
        </div>
        <ComposerApp
          ref="name"
          entityId={this.props.entityId}
          value={this.props.defaultValue}
          onSubmit={this.handleSubmit}
          placeholder={ this.props.labels.commentInputPlaceholder }
          onChange={this.handleChangeInMentionBox}
          scrollListToBottom={this.props.scrollListToBottom}
        />
        {this.renderCompositionOptionsButton()}
      </div>
    );
  };

  render() {
    return (
      <div className={styles.rootOpen}>
        { this.state.open ?
          <div className={styles.optionsRoot}>
            {this.renderFileUploader()}
            {this.renderAgendaItem()}
            {this.renderDeliverable()}
          </div> : undefined }
        {this.renderCommentCompositionBox()}
      </div>
    );
  }

}

export default CommentComposer;
