export const initialState = {taskList:[],isAuthenticated:false};
export function appReducer(state,action){
    // Different action type to perform different action
    switch (action.type){
        case "UPDATE_TASKLIST":
            return {...state,
                taskList:action.payload}
        case "ADD_TASK":
            return {
                ...state,
                taskList:[...state.taskList,action.payload]
            };
        case "UPDATE_TASK":
            return {
                ...state,
                taskList : state.taskList.map(task=>
                    task.id === action.payload.id ? {...task,...action.payload} : task
                )
            };
        case "AUTHORIZE":
            return {
                ...state,
                isAuthenticated:true
            }
        case "UNAUTHORIZE":
            return {
                ...state,
                isAuthenticated:false
            }
        default:
            return state;
    }
}