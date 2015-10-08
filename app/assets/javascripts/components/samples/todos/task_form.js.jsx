class TaskForm extends React.Component {
  constructor() {
    super();

    this.handleSubmit = (e) => {
      e.preventDefault();
      name = React.findDOMNode(this.refs.name).value.trim();
      if(!name) return;

      this.props.onTaskSubmit({name: name});

      React.findDOMNode(this.refs.name).value = ''
    }
  }

  render() {
    return (
      <form className="taskForm" onSubmit={this.handleSubmit}>
        <input placeholder="What is it about?" ref="name" />
        <input type="submit" value="Add Task" />
      </form>
    );
  }
}


