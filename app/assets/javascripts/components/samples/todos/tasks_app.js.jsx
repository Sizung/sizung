class TasksApp extends React.Component {
  constructor() {
    super();

    this.handleTaskCreated = (task) => {
      tasks = this.state.tasks.concat([task]);
      this.setState({
        tasks: tasks
      });
    };


    this.addTask = (task) => {
      console.log('Add Task Action');
      console.log(task);
      return {
        type: 'ADD_TASK',
        task: task
      }
    };

    this.tasksAppReducer = (state, action) => {
      const initialState = {
        tasks: []
      };
      if (typeof state === 'undefined') {
        return initialState;
      }

      if(action.type === 'ADD_TASK') {
        state.tasks = state.tasks.concat([action.task]);
      }

      return state;
    }

  }

  render() {
    let store = Redux.createStore(this.tasksAppReducer);

    return (
      <ReactRedux.Provider store={store}>
        {
          () =>
            <TaskListBox tasks={store.getState().tasks} onTaskCreated={ task => store.dispatch(this.addTask(task)) } />
        }
      </ReactRedux.Provider>
    )
  }
}