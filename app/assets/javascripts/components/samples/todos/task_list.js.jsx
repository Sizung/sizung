class TaskList extends React.Component {
  render() {
    var taskNodes = this.props.tasks.map((task) => {
      return(<Task key={task.id} name={task.name} />);
    });

    return (
      <div className='taskList'>
        {taskNodes}
      </div>
    )
  }
}
