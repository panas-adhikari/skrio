import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Addtask } from "../context/apiManager";
import { Modal, Button } from "react-bootstrap";

function AddTaskComponent(props) {
  // Available options
  const priorities = ["High", "medium", "Low", "None"];
  const categories = [
    "Work",
    "Personal",
    "Study",
    "Shopping",
    "Health",
    "Finance",
    "Home",
    "Travel",
    "Social",
    "Other",
  ];

  // State of different form input elements
  const [description, setDescription] = useState(
    props.description ? props.description : ""
  );
  const [date, setDate] = useState(props.date ? props.date : "");
  const [priority, setPriority] = useState(
    props.priority ? props.priority : "High"
  );
  const [category, setCategory] = useState(
    props.category ? props.category : "Work"
  );
  const { dispatch } = useAppContext();

  // using useeffect for updating components when the props change
  useEffect(() => {
    if (props.description) {
      setDescription(props.description);
    }
  }, [props.description]);

  useEffect(() => {
    if (props.date) {
      setDate(props.date);
    }
  }, [props.date]);

  useEffect(() => {
    if (props.priority) {
      setPriority(props.priority);
    }
  }, [props.priority]);

  useEffect(() => {
    if (props.category) {
      setCategory(props.category);
    }
  }, [props.category]);

  // Simple data validator
  function isDataGood() {
    if (!description || !date) {
      return false;
    }
    return true;
  }

  // Function to update the api and dispatch the update to the app context when the submit button is clicked
  function saveClick(event) {
    event.preventDefault();
    if (!isDataGood()) {
      alert("Please fill out the form correctly");
      return;
    }
    const task = {
      task_heading: description,
      task_due_date: date,
      task_priority: priority,
      task_category: category,
    };
    Addtask(task, dispatch);
    setDescription("");
    setDate("");
    setPriority("High");
    setCategory("Work");
  }

  return (
    // A modal which pops up when add task button is clicked used for adding and updating tasks
    <Modal show={props.show} onHide={() => props.setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.actionType === "update" ? "Update Task" : "Add New Task"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="taskForm">
          <form>
            <div className="form-group">
              <label htmlFor="description">Task Description</label>
              <input
                type="text"
                className="form-control"
                id="taskDescription"
                name="taskDescription"
                value={description}
                placeholder="Describe your task"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                className="form-control"
                id="dueDate"
                name="dueDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Select due date"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                className="form-control"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                {priorities.map((p) => {
                  return (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="form-control"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })}
              </select>
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.setShow(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={(e) => {
            props.setShow(false);
            if (props.actionType === "save") {
              saveClick(e);
            } else {
              props.setUpdate({
                description,
                date,
                priority,
                category,
              });
            }
          }}
        >
          {props.actionType === "update" ? "Update" : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTaskComponent;
