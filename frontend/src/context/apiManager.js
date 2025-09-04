import axios from "axios";

const axios_base_url = "http://192.168.1.65:5000/";
//function to get the tasks from the backend api
function FetchTaskList(dispatch) {
  // console.log("jwt token "+localStorage.getItem("token"));
  const asyncFetch = async () => {
    try {
      const response = await axios.get(`${axios_base_url}get_tasks` , {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}} );
      if (response.status === 200) {
        const taskList = response.data;
        // console.log(taskList);
        dispatch({ type: "UPDATE_TASKLIST", payload: taskList });
      } else {
        console.log("STATUS CODE : " + response.status);
      }
    } catch (e) {
      console.log("ERROR " + e);
    }
  };
  asyncFetch();
}

//function to delete api in the backend adnd dispatch the update to the app context
function DeleteTask(taskId, dispatch) {
  // const {dispatch} = useAppContext();
  // console.log("jwt token "+localStorage.getItem("token"));
  // console.log("Delete Task function for " + taskId);
  const asyncDel = async () => {
    try {
      const response = await axios.delete(
        `${axios_base_url}tasks/delete/${taskId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
      );
      // console.log("Delete Task API Response: ", response);
      if (response.status === 200) {
        // console.log("Deleted Successfully, Fetching Updated Task List");
        FetchTaskList(dispatch);
      }
    } catch (e) {
      console.log("Error : " + e);
    }
  };
  asyncDel();
}

//function to add task to the app context and to the backend
function Addtask(task, dispatch) {
  // console.log("jwt token "+localStorage.getItem("token"));
  const asyncAdd = async () => {
    try {
      const response = await axios.post(`${axios_base_url}add_task`, task , {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});

      if (response.status === 201) {
        task.id = response.data.task_id;
        task.task_done = "Pending";
        dispatch({ type: "ADD_TASK", payload: task });
      }
    } catch (e) {
      console.log(e);
    }
  };
  asyncAdd();
}

function UpdateTask(task, dispatch) {
  // console.log("jwt token "+localStorage.getItem("token"));
  const asyncUpdate = async () => {
    try {
      const response = await axios.put(
        `${axios_base_url}tasks/update/${task.id}`,
        task
      , { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.status === 200) {
        dispatch({ type: "UPDATE_TASK", payload: task });
      }
    } catch (e) {
      console.log(e);
    }
  };
  asyncUpdate();
}

function RegisterNewUser(credentials) {
  const asyncRegister = async () => {
    try {
      const response = await axios.post(
        `${axios_base_url}register`,
        credentials
      );

      if (response.status === 200) {
        const data = response.data;

        if (data.status === "success") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user || {}));
          localStorage.setItem("isLoggedIn", "true");
          return { success: true };
        } else {
          console.log("Registration failed:", data.message);
          return { success: false };
        }
      }
    } catch (e) {
      console.log(e);
    return { success: false };
    }
  };
  return asyncRegister();
}
async function HandleLogin(credentials) {
  try {
    const response = await axios.post(
      `${axios_base_url}login`,
      credentials
    );

    if (response.status === 200) {
      const data = response.data;
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };   // <-- FIX
      } else {
        return { success: false, message: data.message };
      }
    }
    return { success: false };
  } catch (e) {
    console.log("Login error:", e);
    return { success: false, error: e };
  }
}
export {
  FetchTaskList,
  DeleteTask,
  Addtask,
  UpdateTask,
  HandleLogin,
  RegisterNewUser,
};
