import React, { PropTypes } from 'react';
import styles from './index.css';
import SelectIcon from '../SelectIcon';

class SelectableUser extends React.Component {

  handleSelect = () => {
    this.props.onUpdate(this.props.user.id);
  };

  userName = (user) => {
    return ((user.firstName && user.lastName) ? (user.firstName + ' ' + user.lastName) : user.email);
  };

  render() {
    const { user, selected } = this.props;
    return (
        <div onClick={ this.props.onUpdate ? this.handleSelect : false} className={styles.root}>
          <span className={styles.status}>
            <SelectIcon selected={selected}/>
          </span>
          <span className={styles.userContainer} title={user.email}>
            { this.userName(user) }
          </span>
        </div>
    );
  }
}

SelectableUser.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    presenceStatus: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func,
};

export default SelectableUser;
