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

      this.props.createComment({commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name});
      this.refs.name.getInputDOMNode().value = '';
    };

    this.handleAgendaItem = (e) => {
      e.preventDefault();

      //React.findDOMNode fails while using React-Bootstrap components. Instead getInputDOMNode() used
      name = this.refs.name.getInputDOMNode().value.trim();
      //name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.createAgendaItem({conversation_id: this.props.parent.id, title: name});
      this.refs.name.getInputDOMNode().value = '';
    }

    this.handleDeliverable = (e) => {
      e.preventDefault();

      //React.findDOMNode fails while using React-Bootstrap components. Instead getInputDOMNode() used
      name = this.refs.name.getInputDOMNode().value.trim();
      //name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.createDeliverable({agenda_item_id: this.props.parent.id, title: name});
      this.refs.name.getInputDOMNode().value = '';
    }
  }

  render() {
    const { currentUser } = this.props;
    var buttons = [];
    if (this.props.canCreateAgendaItem) {
      buttons.push(<Button key="createAgendaItem" className="btn btn-xs" type="submit" onClick={this.handleAgendaItem} style={{border: 'none'}} ><i className="fa fa-tag text-muted"></i></Button>);
    }
    if (this.props.canCreateDeliverable) {
      buttons.push(<Button key="createDeliverable" className="btn btn-xs" type="submit" onClick={this.handleDeliverable} style={{border: 'none'}} ><i className="fa fa-tasks text-muted"></i></Button>);
    }

    return (
      <div className="col-xs-12 zero-padding padding-sm-vertical" style={{border : '0px solid #eeeeee', borderTopWidth : '1px'}}>
        <div className="col-xs-1">
          <User user={currentUser} />
        </div>
        <form className="commentForm" ref="commentFormRef" onSubmit={this.handleSubmit}>
          <div className="col-xs-11" style={{paddingLeft: '0px'}}>
            <Input className="zero-padding col-xs-12" style={{border: 'none', outline: 'none', boxShadow: 'none'}} type="text" placeholder="Type your comment here" ref="name"/>
            <ButtonGroup className="pull-right">
              <Button key="createComment" className="btn btn-xs" type="submit" onClick={this.handleSubmit} style={{border: 'none'}} ><i className="fa fa-comment text-muted"></i></Button>
              { buttons }
            </ButtonGroup>
          </div>
        </form>
      </div>
    );
  }
}

CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired,
  createAgendaItem: PropTypes.func,
  createDeliverable: PropTypes.func,
  parent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  currentUser : PropTypes.object.isRequired,
  canCreateAgendaItem: PropTypes.bool.isRequired,
  canCreateDeliverable: PropTypes.bool.isRequired
};

export default CommentForm;