import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { FetchTaskList, DeleteTask, UpdateTask } from "../context/apiManager";
import AddTaskComponent from "./addTask";
import "./toggle.css";
function TaskList() {
  const { state, dispatch } = useAppContext(); //to get and to dispatch update to app context
  const [updateShow, setUpdateShow] = useState(false);
  const [description, setDescription] = useState(null);
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState(null);
  const [category, setCategory] = useState(null);
  const [id, setID] = useState(null);

  // when update is clicked then set the value and finally , show the modal
  const handleUpdate = (id) => {
    const update_task = state.taskList.find((task) => task.id === id);
    setID(update_task.id);
    setDescription(update_task.task_heading);
    setDate(update_task.task_due_date);
    setPriority(update_task.task_priority);
    setCategory(update_task.task_category);
    setUpdateShow(true);
  };

  const setupdata = (data) => {
    const updatedTask = {
      id: id,
      task_heading: data.description,
      task_due_date: data.date,
      task_priority: data.priority,
      task_category: data.category,
    };
    UpdateTask(updatedTask, dispatch);
    setUpdateShow(false);
  };

  const handleDelete = (id) => {
    DeleteTask(id, dispatch);
  };

  const handleComplete = (e, id, task) => {
    const isChecked = e.target.checked;
    task["id"] = id;
    if (isChecked) {
      task["task_done"] = "Done";
    } else {
      task["task_done"] = "Pending";
    }
    console.log(task);
    UpdateTask(task, dispatch);
  };

  useEffect(() => {
    FetchTaskList(dispatch);
  }, [dispatch]);
  return (
    <>
      <AddTaskComponent
        show={updateShow}
        setShow={setUpdateShow}
        description={description}
        date={date}
        priority={priority}
        category={category}
        setUpdate={setupdata}
        actionType="update"
      />
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
            <th scope="col">Complete</th>
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
                <td>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => handleUpdate(task.id)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <div className="checkbox-wrapper mx-2">
                    <input
                      id={`_checkbox-${task.id}`}
                      type="checkbox"
                      onClick={(e) => handleComplete(e, task.id, task)}
                      defaultChecked={task.task_done === "Done"}
                    />
                    <label htmlFor={`_checkbox-${task.id}`}>
                      <div className="tick_mark"></div>
                    </label>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td></td>
              <td>No Task to show</td>
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
    </>
  );
}
export default TaskList;
