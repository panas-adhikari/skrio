import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Addtask } from "../context/apiManager";
import { Modal, Button } from "react-bootstrap";

// import "./addTask.css";
function AddTaskComponent({ show, setShow }) {

  //available options
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

  //state of different form input elements
  const [description, setDescription] = useState(null);
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState("High");
  const [category, setCategory] = useState("Work");
  const { dispatch } = useAppContext();

  //simple data validatpr
  function isDataGood(){
    if(!description || !date){
      return false;
    }
    return true;
  }

  //function to update the api and to dispatch the update to the app context when submit buton is clicked
  function saveClick(event) {
    event.preventDefault();
    if(!isDataGood()){
      alert("Please fill out the form correctly");
      return;
    }
    const task = {
      task_heading: description,
      task_due_date: date,
      task_priority: priority,
      task_category: category,
    };
    //after submission reseting the values
    Addtask(task, dispatch);
    setDescription(null);
    setDate(null);
    setPriority("High");
    setCategory("Work");
  }
  return (
    // A modal which pops up when add task button is clicked
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <div className="taskForm">
            <form>
              <div className="form-group">
                <label htmlFor="description">Task Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="taskDescription"
                  name="taskDescription"
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
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Select due date"
                  required
                />
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    className="form-control"
                    name="priority"
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  >
                    {priorities.map((priority) => {
                      return (
                        <option key={priority} value={priority}>
                          {priority}
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
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((category) => {
                      return (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </form>
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={(e) => { setShow(false); saveClick(e); }}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTaskComponent;
