import React, { PropTypes } from 'react';
import styles from './SizungInput.css';
import { Mention, MentionsInput } from 'react-mentions';

class SizungInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onKeyDown: PropTypes.func,
    onSubmit: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    defaultValue: '',
  };

  constructor(properties) {
    super(properties);

    this.state = {
      value: properties.value ? properties.value : properties.defaultValue,
    };
  }

  componentWillReceiveProps(properties) {
    if (properties.value !== null && properties.value !== undefined) {
      this.setState({ value: properties.value });
    }
  }

  handleChange = (ev, value) => {
    this.setState({
      value,
    });

    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }
  };

  handleKeyDown = (e) => {
    const value = this.state.value;

    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      if (this.props.onSubmit) {
        this.props.onSubmit(value);
      }
    } else if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  handleBlur = (e) => {
    if (this.props.onBlur) {
      this.props.onBlur(e, this.state.value);
    }
  };

  render() {
    return (
      <MentionsInput value={this.state.value}
                     onChange={this.handleChange}
                     onKeyDown={this.handleKeyDown}
                     onBlur={this.handleBlur}
                     rows="1"
                     markup="@[__display__](__id__)"
      >
        <Mention  trigger="@"
                  singleLine={false}
                  placeholder={"Mention people using '@'"}
                  data={[{ id: '87e5e104-0b1e-48b8-aec3-53d7043ab529', display: 'Günter Glück' }, { id: '222', display: 'Elza Tabakova' }]}
                  renderSuggestion={this.renderUserSuggestion}
        />
      </MentionsInput>
    );
  }
}

export default SizungInput;
