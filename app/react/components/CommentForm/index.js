import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import User from './../User/index';
import CSSModules from 'react-css-modules';
import styles from './index.css';
import AgendaItemIcon from '../AgendaItemIcon';
import DeliverableIcon from '../DeliverableIcon';
import ChatIcon from '../ChatIcon';
import TextareaAutosize from 'react-autosize-textarea';


@CSSModules(styles)
class CommentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      hasInput: false,
    };

    this.handleSubmit = (e) => {
      // React.findDOMNode fails while using React-Bootstrap components. Instead getDOMNode() used
      const name = this.inputNode.value.trim();
      //name = React.findDOMNode(this.refs.name).value.trim();
      // if(!name) return;

      this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      this.inputNode.value = '';
      this.setState({ hasInput: false });
    };

    this.handleAgendaItem = (e) => {
      e.preventDefault();

      // React.findDOMNode fails while using React-Bootstrap components. Instead getDOMNode() used
      const name = this.inputNode.value.trim();
      // if(!name) return;

      this.props.createAgendaItem({ conversation_id: this.props.parent.id, title: name });
      this.inputNode.value = '';
      this.setState({ hasInput: false });
    }

    this.handleDeliverable = (e) => {
      e.preventDefault();

      // React.findDOMNode fails while using React-Bootstrap components. Instead getDOMNode() used
      const name = this.inputNode.value.trim();
      // if(!name) return;

      this.props.createDeliverable({agenda_item_id: this.props.parent.id, title: name});
      this.inputNode.value = '';
      this.setState({ hasInput: false });

    }

    this.handleChange = (e) => {
      // React.findDOMNode fails while using React-Bootstrap components. Instead getDOMNode() used
      const name = this.inputNode.value.trim();
      if (!name) {
        if (this.state.hasInput) {
          this.setState({ hasInput: false });
        }
      } else {
        if (!this.state.hasInput) {
          this.setState({ hasInput: true });
        }
      }
    }


    this.handleKeyPress = (e) => {
      const name = this.inputNode.value.trim();
      if (name) {
        if (e.charCode === 13 && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit();
        }
      }
    }

    this.handleOnResize = (e) => {
      var resizedHeightDifference;
      if (this.inputNode !== null && this.formNode !== null ) {
        resizedHeightDifference = $(this.inputNode).height() - parseInt($(this.inputNode).css('min-height').split('px')[0]);
        $(this.formNode).css('height', parseInt($(this.formNode).css('min-height').split('px')[0]) + resizedHeightDifference + 'px');
        this.props.onResize($(this.formNode).outerHeight());
      }
    }
  }

  componentDidMount() {
    this.inputNode = React.findDOMNode(this.refs.name);
    this.formNode = React.findDOMNode(this.refs.formContainer);
    this.commentButtonNode = React.findDOMNode(this.refs.commentButton);
  }

  componentDidUpdate() {
    if (!this.state.hasInput) {
      // TODO: Find a better alternative to correct this dirty way of dispatching a change event to resize textarea on submit
      this.inputNode.dispatchEvent(new Event('input'));
    }
  }

  render() {
    let currentConversation;
    let commentActionsStyleName;
    const { currentUser } = this.props;
    let buttons = [];
    if (this.props.canCreateAgendaItem) {
      buttons.push(<Button tabIndex='3' key="createAgendaItem" styleName='agenda-item-btn' type="submit" onClick={this.handleAgendaItem}><AgendaItemIcon size={'small'}/>Agenda Item</Button>);
    }
    if (this.props.canCreateDeliverable) {
      buttons.push(<Button tabIndex='4' key="createDeliverable" styleName='deliverable-btn' type="submit" onClick={this.handleDeliverable}><DeliverableIcon size={'small'}/>Deliverable</Button>);
    }

    commentActionsStyleName = 'input-btn-group';
    if (!this.state.hasInput) {
      commentActionsStyleName = 'hide-input-btn-group';
    }

    currentConversation = null;
    if (this.props.parent.type === 'agendaItems') {
      currentConversation = this.props.parent.conversation;
    } else if (this.props.parent.type === 'deliverables') {
      currentConversation = this.props.parent.agendaItem.conversation;
    } else if (this.props.parent.type === 'conversations') {
      currentConversation = this.props.parent;
    }

    return (
      <div styleName='root'>
        <ButtonGroup styleName={commentActionsStyleName} ref='commentActions'>
          <Button tabIndex='2' ref='commentButton' styleName='comment-btn' key="createComment" type="submit" onClick={this.handleSubmit}><ChatIcon size={'small'}/>Comment</Button>
          { buttons }
        </ButtonGroup>
      <div ref='formContainer' styleName='form-container'>
        <div styleName='user'>
          <User user={currentUser} />
        </div>
        <div styleName='input-form'>
          <form className="form-horizontal" ref="commentFormRef" onSubmit={this.handleSubmit}>
            <div styleName='input-container'>
              <TextareaAutosize ref="name" className='form-control' onResize={this.handleOnResize} onKeyPress={this.handleKeyPress} onChange={this.handleChange} rows="1" styleName='input' placeholder='Type your comment here'/>
            </div>
          </form>
        </div>
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
    type: PropTypes.string.isRequired,
  }).isRequired,
  currentUser : PropTypes.object.isRequired,
  canCreateAgendaItem: PropTypes.bool.isRequired,
  canCreateDeliverable: PropTypes.bool.isRequired,
  onResize: PropTypes.func,
};

export default CommentForm;