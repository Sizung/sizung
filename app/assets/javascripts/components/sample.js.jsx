// This is a sample React component to show the best practices we use within Sizung.
// It should always be updated to our latest knowledge, code styles and patterns we learned along the way and agreed on.
class Sample extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div>Name: {this.props.name}</div>
      </div>
    );
  }
}

Sample.defaultProps = {
  name: 'George Guest'
};

Sample.propTypes = {
  name: React.PropTypes.string.isRequired
};
