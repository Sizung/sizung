import React, { PropTypes } from 'react';
import styles from './DeliverableComposer.css';
import SizungInputApp from '../../containers/SizungInputApp';

class DeliverableComposer extends React.Component {
  static propTypes = {
    createDeliverable: PropTypes.func.isRequired,
    parent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      value: '',
    };

    this.handleSubmit = (e) => {
      const name = this.state.value.trim();
      if (name === '') { return; } // TODO: Improve that quickfix when the whole new ui behavior gets implemented
      this.props.createComment({ commentable_id: this.props.parent.id, commentable_type: this.props.parent.type, body: name });
      this.setState({ value: '' });
    };
  }

  render() {
    return (
      <div className={styles.root}>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <SizungInputApp ref="name" onChange={this.handleChangeInMentionBox} onSubmit={this.handleSubmit} value={this.state.value} rows="1" placeholder="Type your deliverable here" />
        </form>
      </div>
    );
  }
}

export default DeliverableComposer;
