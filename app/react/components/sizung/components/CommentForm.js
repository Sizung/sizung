import React, { Component, PropTypes } from 'react';
import { Input,Button, ButtonGroup } from 'react-bootstrap';
import User from './User';

class CommentForm extends React.Component {
  constructor() {
    super();

    this.handleSubmit = (e) => {
      e.preventDefault();

      //React.findDOMNode fails while using React-Bootstrap components. Instead getInputDOMNode() used
      name = this.refs.name.getInputDOMNode().value.trim();
      //name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.createComment({conversation_id: this.props.currentConversation.id, body: name});

      this.refs.name.getInputDOMNode().value = '';
    };

    this.handleAgendaItem = (e) => {
      e.preventDefault();

      //React.findDOMNode fails while using React-Bootstrap components. Instead getInputDOMNode() used
      name = this.refs.name.getInputDOMNode().value.trim();
      //name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.createAgendaItem({conversation_id: this.props.currentConversation.id, title: name});

      this.refs.name.getInputDOMNode().value = '';
    }

  }


  render() {
    const { currentUser } = this.props;

    return (
      <div className="col-xs-12 zero-padding padding-sm-vertical" style={{border : '0px solid #eeeeee', borderTopWidth : '1px'}}>
        <User user={currentUser} />
        <form className="commentForm" ref="commentFormRef" onSubmit={this.handleSubmit}>
          <div className="col-xs-11" style={{paddingLeft: '0px'}}>
            <Input className="zero-padding col-xs-12" style={{border: 'none', outline: 'none', boxShadow: 'none'}} type="text" placeholder="Type your comment here" ref="name"/>
            <ButtonGroup className="pull-right">
              <Button className="btn btn-xs" type="submit" style={{border: 'none'}} ><i className="fa fa-comment text-muted"></i></Button>
              <Button className="btn btn-xs" type="submit" onClick={this.handleAgendaItem} style={{border: 'none'}} ><i className="fa fa-tag text-muted"></i></Button>
              <Button className="btn btn-xs" type="submit" style={{border: 'none'}} ><i className="fa fa-tasks text-muted"></i></Button>
              <Button className="btn btn-xs" type="submit" style={{border: 'none'}} ><i className="fa fa-comments text-muted"></i></Button>
            </ButtonGroup>
          </div>
        </form>
      </div>
    );
  }
}


CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func.isRequired,
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  currentUser : PropTypes.object.isRequired
};

export default CommentForm;