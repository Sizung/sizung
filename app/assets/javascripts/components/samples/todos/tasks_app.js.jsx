class TasksApp extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: []
    };

    this.handleTaskCreated = (task) => {
      tasks = this.state.tasks.concat([task]);
      this.setState({
        tasks: tasks
      });
    };
  }

  render() {
    return (
      <TaskListBox tasks={this.state.tasks} onTaskCreated={this.handleTaskCreated} />
    )
  }
}