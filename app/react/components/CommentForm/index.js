import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
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
      commentActionInFocus: 'comment', //Possible actions: comment, agendaItem, deliverable
    };

    this.commentActions = ['comment'];
    this.handleSubmit = (e) => {
      const name = this.inputNode.value.trim();
      if ( this.state.commentActionInFocus === 'comment') {
        this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      } else if ( this.state.commentActionInFocus === 'agendaItem') {
        this.handleAgendaItem(e);
      } else if ( this.state.commentActionInFocus === 'deliverable') {
        this.handleDeliverable(e);
      }

      this.inputNode.value = '';
      this.setState({ hasInput: false });
    };

    this.handleAgendaItem = (e) => {
      if (e) {
        e.preventDefault();
      }
      const name = this.inputNode.value.trim();
      this.props.createAgendaItem({ conversation_id: this.props.parent.id, title: name });
      this.inputNode.value = '';
      this.setState({ hasInput: false, commentActionInFocus: 'agendaItem' });
    };

    this.handleDeliverable = (e) => {
      if (e) {
        e.preventDefault();
      }
      const name = this.inputNode.value.trim();
      this.props.createDeliverable({ agenda_item_id: this.props.parent.id, title: name });
      this.inputNode.value = '';
      this.setState({ hasInput: false, commentActionInFocus: 'deliverable' });
    };

    this.handleChange = (e) => {
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
    };

    this.handleKeyPress = (e) => {
      const name = this.inputNode.value.trim();
      if (name) {
        if (e.charCode === 13 && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit();
        }
      }
    };

    this.handleKeyDown = (e) => {
      const name = this.inputNode.value.trim();
      if (name) {
        if (e.keyCode === 9 && !e.shifKey) {
          e.preventDefault();
          const nextActionInFocusIndex = ((this.commentActions.indexOf(this.state.commentActionInFocus) + 1) % this.commentActions.length);
          this.setState({ commentActionInFocus: this.commentActions[nextActionInFocusIndex] });
        }
      }
    };

    this.handleOnResize = () => {
      let resizedHeightDifference;
      if (this.inputNode !== null && this.formNode !== null) {
        resizedHeightDifference = $(this.inputNode).height() - parseInt($(this.inputNode).css('min-height').split('px')[0]);
        $(this.formNode).css('height', parseInt($(this.formNode).css('min-height').split('px')[0]) + resizedHeightDifference + 'px');
        this.props.onResize($(this.formNode).outerHeight());
      }
    };
  }

  componentDidMount() {
    this.inputNode = ReactDOM.findDOMNode(this.refs.name);
    this.formNode = this.refs.formContainer;
  }

  componentWillUpdate() {
    if (this.props.canCreateAgendaItem) {
      this.commentActions = ['comment', 'agendaItem'];
    } else if (this.props.canCreateDeliverable) {
      this.commentActions = ['comment', 'deliverable'];
    } else {
      this.commentActions = ['comment'];
    }
  }

  componentDidUpdate() {
    if (!this.state.hasInput) {
      // TODO: Find a better alternative to correct this dirty way of dispatching a change event to resize textarea on submit
      this.inputNode.dispatchEvent(new Event('input'));
    }
  }

  render() {
    let commentActionsStyleName;
    const { currentUser } = this.props;
    let buttons = [];
    if (this.props.canCreateAgendaItem) {
      buttons.push(<Button tabIndex='2' key="createAgendaItem" styleName={ 'agenda-item-btn' + (this.state.commentActionInFocus === 'agendaItem' ? '-active' : '') } type="submit" onClick={this.handleAgendaItem}><AgendaItemIcon size={'small'}/>Agenda Item</Button>);
    }
    if (this.props.canCreateDeliverable) {
      buttons.push(<Button tabIndex='3' key="createDeliverable" styleName={ 'deliverable-btn' + (this.state.commentActionInFocus === 'deliverable' ? '-active' : '') } type="submit" onClick={this.handleDeliverable}><DeliverableIcon size={'small'}/>Deliverable</Button>);
    }

    commentActionsStyleName = 'input-btn-group';
    if (!this.state.hasInput) {
      commentActionsStyleName = 'hide-input-btn-group';
    }

    return (
      <div styleName='root'>
        <ButtonGroup styleName={commentActionsStyleName} ref='commentActions'>
          <Button tabIndex='1' ref='commentButton' styleName={ 'comment-btn' + (this.state.commentActionInFocus === 'comment' ? '-active' : '') } key="createComment" type="submit" onClick={this.handleSubmit}><ChatIcon size={'small'}/>Comment</Button>
          { buttons }
        </ButtonGroup>
        <div ref='formContainer' styleName='form-container'>
          <div styleName='user'>
            <User user={currentUser} />
          </div>
          <div styleName='input-form'>
            <form className="form-horizontal" ref="commentFormRef" onSubmit={this.handleSubmit}>
              <div styleName='input-container'>
                <TextareaAutosize ref="name" className='form-control' onResize={this.handleOnResize} onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress} onChange={this.handleChange} rows="1" styleName='input' placeholder='Type your comment here'/>
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
