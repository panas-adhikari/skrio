import TaskList from "../components/renderTasks";
import AddTaskComponent from "../components/addTask";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

function Home({ setLogout }) {
  const [show, setShow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"))?.username || "User";

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-light py-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo */}
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

          {/* Hamburger + User Avatar */}
          <div className="d-flex align-items-center">
            <Dropdown show={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)}>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                className="border-0 bg-transparent d-flex align-items-center"
              >
                {/* <FaBars size={24} className="me-3" /> */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-username">{user}</Tooltip>}
                >
                  <span>
                    <FaUserCircle size={32} />
                  </span>
                </OverlayTrigger>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item disabled>Signed in as <b>{user}</b></Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={setLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>

      <AddTaskComponent show={show} setShow={setShow} actionType={"save"} />
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
