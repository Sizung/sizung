import React, { Component, PropTypes } from 'react';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.handleSubmit = (e) => {
      e.preventDefault();
      name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.addComment({body: name, author: {name: 'Anonymous'}});

      React.findDOMNode(this.refs.name).value = ''
    }
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input placeholder="What is it about?" ref="name" />
        <input type="submit" value="Add Comment" />
      </form>
    );
  }
}


CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
};

export default CommentForm;