import axios from "axios";

const axios_base_url = "http://127.0.0.1:5000/";
//function to get the tasks from the backend api
async function FetchTaskList(dispatch) {
  try {
    const response = await axios.get(`${axios_base_url}get_tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.status === 200) {
      const taskList = response.data;
      dispatch({ type: "UPDATE_TASKLIST", payload: taskList });
    }
  } catch (e) {
    if (e.response?.status === 401) {
      console.log("unauthorized signal");
      localStorage.clear();
      dispatch({ type: "UNAUTHORIZE" });
    } else {
      console.log("ERROR", e.response || e.message);
    }
  }
}

//function to delete api in the backend adnd dispatch the update to the app context
function DeleteTask(taskId, dispatch) {
  // const {dispatch} = useAppContext();
  // console.log("jwt token "+localStorage.getItem("token"));
  // console.log("Delete Task function for " + taskId);
  const asyncDel = async () => {
    try {
      const response = await axios.delete(
        `${axios_base_url}tasks/delete/${taskId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log("Delete Task API Response: ", response);
      if (response.status === 200) {
        // console.log("Deleted Successfully, Fetching Updated Task List");
        FetchTaskList(dispatch);
      }
    } catch (e) {
      if (e.response?.status === 401) {
      console.log("unauthorized signal");
      localStorage.clear();
      dispatch({ type: "UNAUTHORIZE" });
    } else {
      console.log("ERROR", e.response || e.message);
    }
    }
  };
  asyncDel();
}

//function to add task to the app context and to the backend
function Addtask(task, dispatch) {
  // console.log("jwt token "+localStorage.getItem("token"));
  const asyncAdd = async () => {
    try {
      const response = await axios.post(`${axios_base_url}add_task`, task, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 201) {
        task.id = response.data.task_id;
        task.task_done = "Pending";
        dispatch({ type: "ADD_TASK", payload: task });
      }
    } catch (e) {
      if(e.response?.status===401)
      dispatch({type:"UNAUTHORIZED"});
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
        task,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200) {
        dispatch({ type: "UPDATE_TASK", payload: task });
      }
    } catch (e) {
      if (e.response?.status === 401) {
      console.log("unauthorized signal");
      localStorage.clear();
      dispatch({ type: "UNAUTHORIZE" });
    } else {
      console.log("ERROR", e.response || e.message);
    }
      console.log(e);
    }
  };
  asyncUpdate();
}

async function RegisterNewUser(credentials) {
    try {
      const response = await axios.post(
        `${axios_base_url}register`,
        credentials
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("register obtained data "+data);
        if (data.status === "success") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("isLoggedIn", "true");
          return { success: true ,message:"Go back to login and try logging in"};
        }
      }
    } catch (e) {
      if(e.response){
        return{
          success:false,
          message: e.response.data.message,
        }
      }
      return { success: false };
    };
}
async function HandleLogin(credentials) {
  try {
    const response = await axios.post(`${axios_base_url}login`, credentials);

    if (response.status === 200) {
      const data = response.data;
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn","true")
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    }
    return { success: false };
  } catch (e) {
    return { success: false, error: e };
  }
}
async function checkUserExists() {
    try {
      const response = await axios.get(`${axios_base_url}check_user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        const data = response.data;
        return data.exists;
      } else {
        console.log("STATUS CODE : " + response.status);
        return false;
      }
    } catch (e) {
      console.log("ERROR " + e);
      return false;
    }
  };
export {
  FetchTaskList,
  DeleteTask,
  Addtask,
  UpdateTask,
  HandleLogin,
  RegisterNewUser,
  checkUserExists,
};
