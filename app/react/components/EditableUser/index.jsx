import React, { PropTypes } from 'react';
import styles from './index.css';
import User from '../User/index';

class EditableUser extends React.Component {
  constructor() {
    super();
    this.state = { edit: false, filter: '' };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.triggerCancel = this.triggerCancel.bind(this);
  }

  handleEditClick(event) {
    this.setState({ edit: true });
  }

  handleChange(event) {
    this.triggerUpdate(event.value);
  }

  triggerUpdate(id) {
    this.props.onUpdate(id);
    this.setState({ edit: false, filter: '' });
  }

  triggerCancel() {
    this.setState({ edit: false, filter: '' });
  }


  handleFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleInputSubmit();
    } else if (event.key === 'Escape') {
      this.triggerCancel();
    }
  }

  handleUserClick(id) {
    this.triggerUpdate(id);
  }

  handleInputSubmit() {
    const { filter } = this.state;
    const filteredOptions = this.filteredOptions(filter, this.props.users);
    if (filter.length > 0 && filteredOptions.size > 0) {
      this.triggerUpdate(filteredOptions.first().id);
    }
  }

  renderShow(selectedUser, editable) {
    return <span className={styles['current-user' + (editable ? '-editable' : '')]} onClick={editable ? this.handleEditClick : null}><User user={selectedUser} size={this.props.size} /></span>;
  }

  filteredOptions(filter, options) {
    return options.filter(function (user) {
      const name = (user.firstName + ' ' + user.lastName).toLowerCase();
      return name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });
  }

  selectedMarker(selectedUser, user) {
    if (selectedUser === user) {
      return <i className={styles.check}></i>;
    }
  }

  renderEdit(selectedUser, users) {
    const { direction } = this.props;
    const options = this.filteredOptions(this.state.filter, users).sortBy((user) => {
      return ( user.firstName && user.lastName) ?  (user.firstName + ' ' + user.lastName).toLowerCase() : user.email.toLowerCase();
    }).map((user) => {
      return (
        <div className={styles['user-row']} onClick={() => this.handleUserClick(user.id)} key={user.id}>
            <span className={styles['user-column']}><User user={user} showName={true}/></span>
            <span className={styles['marker-column']}>{this.selectedMarker(selectedUser, user)}</span>
        </div>
      );
    });

    return (
      <span className={[styles['root'], styles[direction + 'Direction']].join(' ')}>
        <div className={styles.title}>
          Members
          <i className={styles["close-icon"]} onClick={this.triggerCancel}></i>
        </div>
        <input className={styles.input} ref="filterInput" type="text" onKeyDown={this.handleKeyDown} onChange={this.handleFilterChange} placeholder="Search Members"/>
        <div>
          {options}
        </div>
      </span>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.edit && !prevState.edit) {
      const inputElem = this.refs.filterInput;
      inputElem.focus();
    }
  }

  render() {
    const { user, users, editable } = this.props;
    if (this.state.edit) {
      return (
        <div className={styles['root-container']}>
          {this.renderShow(user, editable)}
          {this.renderEdit(user, users)}
        </div>
      );
    } else {
      return this.renderShow(user, editable);
    }
  }
}

EditableUser.propTypes = {
  conversationId: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  users: PropTypes.object,
  userId: PropTypes.string,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    presenceStatus: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  size: PropTypes.string,
  direction: PropTypes.string,
};

EditableUser.defaultProps = {
  editable: true,
  direction: 'south', // possible values: south, north
};

export default EditableUser;
