import React, { Component, PropTypes } from 'react';
import { Input,Button, ButtonGroup } from 'react-bootstrap';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.handleSubmit = (e) => {
      e.preventDefault();

      //React.findDOMNode fails while using React-Bootstrap components. Instead getInputDOMNode() used
      name = this.refs.name.getInputDOMNode().value.trim();
      //name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.createComment({conversation_id: this.props.currentConversation.get('id'), body: name});

      this.refs.name.getInputDOMNode().value = '';
    }

  }


  render() {
    return (
      <form className="commentForm" ref="commentFormRef" onSubmit={this.handleSubmit}>
        <Input type="text" placeholder="Type your comment" ref="name" buttonAfter={<Button type="submit"><i className="fa fa-comment-o"></i></Button>}/>
      </form>
    );
  }
}


CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired,
  currentConversation: PropTypes.object.isRequired
};

export default CommentForm;