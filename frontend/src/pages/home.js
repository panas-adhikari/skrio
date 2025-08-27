import TaskList from "../components/renderTasks";
import AddTaskComponent from "../components/addTask";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button } from "react-bootstrap";

function Home() {
  const [show , setShow] = useState(false); //to store the state of the modal in the addtaskComponent

  return (
    <div className="container">
      <h1 className="font-weight-bold text-center mb-3">My Task List</h1>
      <AddTaskComponent show={show} setShow={setShow} />
      <TaskList />
      <nav className="navbar fixed-bottom navbar-light bg-light justify-content-center">
        <Button variant="primary" size="lg" onClick={() => setShow(true)}>
          Add New
        </Button>
      </nav>
    </div>
  );
}
export default Home;
