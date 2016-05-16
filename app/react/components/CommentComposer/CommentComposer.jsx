import React, { PropTypes } from 'react';
import styles from './CommentComposer.css';
import User from '../User';
import SizungInputApp from '../../containers/SizungInputApp';
import ComposeSelector from '../ComposeSelector/ComposeSelector';
import ReactS3Uploader from 'react-s3-uploader';

class CommentComposer extends React.Component {
  static propTypes = {
    createComment: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      value: '',
    };

    this.handleSubmit = (e) => {
      const name = this.state.value.trim();
      if (name === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
      this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      this.setState({ value: '' });
    };
  }

  handleSelect = (selectedType) => {
    this.props.onSelect(selectedType, this.state.value.trim());
  }

  handleChangeInMentionBox = (ev, value) => {
    this.setState({ value });
  };

  onUploadProgress = (data) => {
    console.log('onUploadProgress: ', data);
  }

  onUploadError = (data) => {
    console.log('onUploadError: ', data);
  }

  onUploadFinish = (data) => {
    console.log('onUploadFinish: ', data);
  }
  
  render() {
    const { parent } = this.props;
    const headers = [];
    const queryParams = [];
    const signingUrl = `/api/${parent.type}/${parent.id}/attachments/new`;
    
    return (
      <div className={styles.root}>
        <div className={styles.user}>
          <User user={this.props.currentUser}/>
        </div>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Write your comment here" />
        </form>
        
        <ReactS3Uploader
            signingUrl={signingUrl}
            accept="image/*"
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            signingUrlHeaders={{ additional: headers }}
            signingUrlQueryParams={{ additional: queryParams }}
            uploadRequestHeaders={{ 'x-amz-acl': 'private' }}
            contentDisposition="auto" />
        <div className={styles.chatButtons}>
          <ComposeSelector onSelect={this.handleSelect} />
        </div>
      </div>
    );
  }
}

export default CommentComposer;
