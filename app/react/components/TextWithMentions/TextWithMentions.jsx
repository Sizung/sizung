import React, { PropTypes } from 'react';
import marked from 'marked';
import styles from './TextWithMentions.css';

class TextWithMentions extends React.Component {

  static propTypes = {
    maxLength: PropTypes.number,
  };

  rawMarkup = () => {
    const pattern = new RegExp(/(.*)@\[(.*)\]\(.*\)(.*)/);

    let text = this.props.children;

    while (text.match(pattern)) {
      text = text.replace(pattern, '$1__$2__$3');
    }

    text = this.props.maxLength && text.length > this.props.maxLength ? text.substring(0, this.props.maxLength) + '...' : text;

    const rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
  };

  render() {
    if (!this.props.children) { return <span></span>; }

    return (
      <span className={styles.root} dangerouslySetInnerHTML={this.rawMarkup()} />
    );
  }
}

export default TextWithMentions;
