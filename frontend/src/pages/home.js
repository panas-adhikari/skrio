import TaskList from "../components/renderTasks";
import AddTaskComponent from "../components/addTask";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button } from "react-bootstrap";

function Home({ setLogout }) {
  const [show, setShow] = useState(false); //to store the state of the modal in the addtaskComponent

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-light py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <span
            className="navbar-brand mb-0"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "2.5rem",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            <span style={{ color: "#66fcf1" }}>Task</span>
            <span style={{ color: "#000000" }}>Book</span>
          </span>

          <button type="button" className="btn btn-danger" onClick={setLogout}>
            Logout
          </button>
        </div>
      </nav>
      {/* <h1 className="font-weight-bold text-center mb-3">My Task List</h1> */}
      {/* <button type="button" className="btn btn-danger" onClick={setLogout}>
        Logout
      </button> */}

      <AddTaskComponent show={show} setShow={setShow} actionType={"save"} />
      <TaskList />
      <nav className="navbar fixed-bottom navbar-light bg-light justify-content-center">
        <Button variant="primary" size="lg" onClick={() => setShow(true)}
          >
          Add New
        </Button>
      </nav>
    </div>
  );
}
export default Home;
