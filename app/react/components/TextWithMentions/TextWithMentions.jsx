import React from 'react';
import marked from 'marked';

class TextWithMentions extends React.Component {

  rawMarkup = () => {
    const pattern = new RegExp(/(.*)@\[(.*)\]\(.*\)(.*)/);

    let text = this.props.children;

    while (text.match(pattern)) {
      text = text.replace(pattern, '$1__$2__$3');
    }

    const rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
  };

  render() {
    return (
      <span dangerouslySetInnerHTML={this.rawMarkup()} />
    );
  }
}

export default TextWithMentions;
