class TaskListBox extends React.Component {
  render() {
    return(<div className="taskListBox">
      Hello, world! I'm a Task List Box!
      <TaskForm onTaskSubmit={this.props.onTaskCreated}/>

      <h1>Tasks</h1>
      <TaskList tasks={this.props.tasks}/>
    </div>);
  }
}
