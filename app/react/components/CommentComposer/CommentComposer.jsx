import React, { PropTypes } from 'react';
import styles from './CommentComposer.css';
import User from '../User';
import SizungInputApp from '../../containers/SizungInputApp';
import ReactS3Uploader from '../ReactS3Uploader';
import Icon from '../Icon';
import Composer from '../Composer';

class CommentComposer extends React.Component {
  static propTypes = {
    createComment: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
    createAttachment: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      value: '',
      uploadStatus: '',
      uploadPercentage: 0,
      open: false,
    };

    this.handleSubmit = (e) => {
      const name = this.state.value.trim();
      if (name === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
      this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      this.setState({ value: '' });
    };
  }

  onUploadProgress = (data) => {
    this.setState({ uploadStatus: 'InProgress', uploadPercentage: data });
  };

  onUploadError = (data) => {
    this.setState({ uploadStatus: 'Error' });
  };

  onUploadFinish = (data) => {
    const fileObject = ReactDOM.findDOMNode(this.refs.input).files[0];
    this.setState({ uploadStatus: '' });
    const { parent } = this.props;
    this.props.createAttachment(parent.type, parent.id, { persistent_file_id: data.signedUrl, file_name: (data.signedUrl.split('?')[0].split('/').pop()), file_size: fileObject.size, file_type: fileObject.type });
  };

  handleChangeInMentionBox = (ev, value) => {
    this.setState({ value });
  };

  handleSelect = (selectedType) => {
    this.props.onSelect(selectedType, this.state.value.trim());
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
    return <div className={styles.option} onClick={this.selectAgendaItem}><Icon type="agendaItem" className={styles.icon}>To Discuss</Icon></div>;
  };

  renderDeliverable = () => {
    return <div className={styles.option} onClick={this.selectDeliverable}><Icon type="deliverable" className={styles.icon} gap='0.5rem'>To Do</Icon></div>;
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
              ref='input'
              signingUrl={signingUrl}
              accept="*/*"
              onProgress={this.onUploadProgress}
              onError={this.onUploadError}
              onFinish={this.onUploadFinish}
              signingUrlHeaders={{ additional: headers }}
              signingUrlQueryParams={{ additional: queryParams }}
              uploadRequestHeaders={{ 'x-amz-acl': 'private' }}
              contentDisposition="auto" />
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

//  <form className={styles.form} onSubmit={this.handleSubmit}>
//  <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Write your comment here" />
//  </form>

  renderCommentCompositionBoxOnly = () => {
    return (
      <div className={styles.rootClosed}>
        <div className={styles.user}>
          <User user={this.props.currentUser}/>
        </div>
        <Composer ref="name" onSubmit={this.handleSubmit} value={this.state.value} placeholder="Write your comment here" />
        {this.renderCompositionOptionsButton()}
      </div>
    );
  };

  renderCommentCompositionBoxWithOptions = () => {
    return (
      <div className={styles.rootOpen}>
        <div className={styles.optionsRoot}>
          {this.renderFileUploader()}
          {this.renderAgendaItem()}
          {this.renderDeliverable()}
        </div>
        {this.renderCommentCompositionBoxOnly()}
      </div>
    );
  };

  render() {
    return this.state.open ? this.renderCommentCompositionBoxWithOptions() : this.renderCommentCompositionBoxOnly();
  }

}

export default CommentComposer;
