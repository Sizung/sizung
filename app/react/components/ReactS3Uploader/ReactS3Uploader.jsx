import React, { PropTypes }  from 'react';
import ReactDOM from 'react-dom';
import S3Upload from './s3upload';
import objectAssign from 'object-assign';

class ReactS3Uploader extends React.Component {

  static propTypes = {
    signingUrl: React.PropTypes.string.isRequired,
    onProgress: React.PropTypes.func,
    onFinish: React.PropTypes.func,
    onError: React.PropTypes.func,
    signingUrlHeaders: React.PropTypes.object,
    signingUrlQueryParams: React.PropTypes.object,
    uploadRequestHeaders: React.PropTypes.object,
    contentDisposition: React.PropTypes.string,
    server: React.PropTypes.string,
  };

  static defaultProps = {
    server: '',
  };

  uploadFile = () => {
    new S3Upload({
      fileElement: ReactDOM.findDOMNode(this),
      signingUrl: this.props.signingUrl,
      onProgress: this.props.onProgress,
      onFinishS3Put: this.props.onFinish,
      onError: this.props.onError,
      signingUrlHeaders: this.props.signingUrlHeaders,
      signingUrlQueryParams: this.props.signingUrlQueryParams,
      uploadRequestHeaders: this.props.uploadRequestHeaders,
      contentDisposition: this.props.contentDisposition,
      server: this.props.server
    });
  };

  clear = () => {
    clearInputFile(ReactDOM.findDOMNode(this));
  };

  // http://stackoverflow.com/a/24608023/194065
 clearInputFile = (f) => {
    if (f.value) {
      try {
        f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
      } catch (err) { }
      if (f.value) { //for IE5 ~ IE10
        let form = document.createElement('form'),
            parentNode = f.parentNode, ref = f.nextSibling;
        form.appendChild(f);
        form.reset();
        parentNode.insertBefore(f,ref);
      }
    }
  };

  render() {
    return React.DOM.input(objectAssign({}, this.props, {type: 'file', onChange: this.uploadFile}));
  }

}

export default ReactS3Uploader;
