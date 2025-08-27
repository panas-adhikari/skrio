import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import { FetchTaskList, DeleteTask } from "../context/apiManager";

function TaskList() {
  const { state, dispatch } = useAppContext(); //to get and to dispatch update to app context
  const handleDelete = (id) => {
    DeleteTask(id, dispatch);
  };

  useEffect(() => {
    FetchTaskList(dispatch);
  }, [dispatch]);
  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Task</th>
          <th scope="col">Priority</th>
          <th scope="col">Category</th>
          <th scope="col">Pending</th>
          <th scope="col">Due Date</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {state.taskList && state.taskList.length > 0 ? (
          state.taskList.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.task_heading}</td>
              <td>{task.task_priority}</td>
              <td>{task.task_category}</td>
              <td>{task.task_done}</td>
              <td>{task.task_due_date}</td>
              <td><button type="button" className="btn btn-danger" onClick={()=>handleDelete(task.id)}>Delete</button></td>
            </tr>
          ))
        ) : (
         <tr> <td>No Task to show</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
         </tr>
        )}
      </tbody>
    </table>
  );
}
export default TaskList;
