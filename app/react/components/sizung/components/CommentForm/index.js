import React, { Component, PropTypes } from 'react';
import { Input,Button, ButtonGroup } from 'react-bootstrap';
import User from './../User/index';
import CSSModules from 'react-css-modules';
import styles from "./index.css";


@CSSModules(styles)
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

    this.handleConversation = (e) => {
      e.preventDefault();
      //TBD
    }
  }

  render() {
    const { currentUser } = this.props;
    var buttons = [];
    if (this.props.canCreateAgendaItem) {
      buttons.push(<Button key="createAgendaItem" styleName='agenda-item-btn' type="submit" onClick={this.handleAgendaItem}><i styleName='agenda-item-icon'></i></Button>);
    }
    if (this.props.canCreateDeliverable) {
      buttons.push(<Button key="createDeliverable" styleName='deliverable-btn' type="submit" onClick={this.handleDeliverable}><i styleName='deliverable-icon'></i></Button>);
    }

    var currentConversation = null;
    if ( null != this.props.parent.type ) {
      switch (this.props.parent.type) {
        case 'agendaItems':
          currentConversation = this.props.parent.conversation;
          break;

        case 'deliverables':
          currentConversation = this.props.parent.agendaItem.conversation;
          break;
      }
    } else {
      currentConversation = this.props.parent;
    }

    return (
      <div styleName='form-container'>
        <div styleName='user'>
          <User user={currentUser} />
        </div>
        <div styleName='input-form'>
          <form className="form-horizontal" ref="commentFormRef" onSubmit={this.handleSubmit}>
            <div styleName='input-container'>
              <Input groupClassName='zero-margin' styleName='input' type="text" placeholder="Type your comment here" ref="name"/>
            </div>
            <ButtonGroup styleName='input-btn-group'>
              <Button styleName='comment-btn' key="createComment" type="submit" onClick={this.handleSubmit}><i styleName='comment-icon'></i></Button>
              { buttons }
              <Button href={"/organizations/" + currentConversation.organization_id + "/conversations/new"} key="createConversation" styleName='conversation-btn'><i styleName='conversation-icon'></i></Button>
            </ButtonGroup>
          </form>
        </div>
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