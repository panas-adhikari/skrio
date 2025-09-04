export const initialState = {taskList:[]};
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
        default:
            return state;
    }
}