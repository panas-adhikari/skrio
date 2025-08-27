import axios from "axios"

//function to get the tasks from the backend api
function FetchTaskList(dispatch){
    const asyncFetch =async ()=>{
    try{
        const response = await axios.get("http://127.0.0.1:5000/get_tasks");
        if(response.status === 200){
            const taskList = response.data;
            console.log(taskList)
            dispatch({type:"UPDATE_TASKLIST",payload:taskList});
        }else{
            console.log("STATUS CODE : "+response.status);
        }
    }catch(e){
        console.log("ERROR "+e);
    }
}
asyncFetch();
}

//function to delete api in the backend adnd dispatch the update to the app context
function DeleteTask(taskId,dispatch){
    // const {dispatch} = useAppContext();
    const asyncDel = async()=>{
        try{
            const response = await axios.delete(`http://127.0.0.1:5000/tasks/delete/${taskId}`)
            if(response.status===200){
                FetchTaskList(dispatch);
            }
        }catch (e){
            console.log("Error : "+e);
        }
    }
    asyncDel();
}

//function to add task to the app context and to the backend
function Addtask(task,dispatch){
    const asyncAdd = async()=>{
        try{
            const response = await axios.post(`http://127.0.0.1:5000/add_task`,task);

            if(response.status===201){
                task.id = response.data.task_id;
                task.task_done = "Pending";
                dispatch({type:"ADD_TASK",payload:task});
            }
        }catch(e){
            console.log(e);
        }
    }
    asyncAdd();
}
export {FetchTaskList, DeleteTask,Addtask};