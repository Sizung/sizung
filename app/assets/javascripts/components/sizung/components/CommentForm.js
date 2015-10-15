import React, { Component, PropTypes } from 'react';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.handleSubmit = (e) => {
      e.preventDefault();
      name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.addComment({conversation_id: this.props.currentConversation.id, body: name});

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
  addComment: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired
};

export default CommentForm;