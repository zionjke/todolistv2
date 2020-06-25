import {api} from "../dal/api";

const CREATE_TODOLIST = 'CREATE_TODOLIST';
const CREATE_TASK = 'CREATE_TASK';
const CHANGE_TASK = 'CHANGE_TASK';
const DELETE_TODO = 'DELETE_TODO';
const DELETE_TASK = 'DELETE_TASK';
const SET_TODOLISTS = 'SET_TODOLISTS';
const SET_TODOLISTS_TASKS = 'SET_TODOLISTS_TASKS';
const CHANGE_TODO_TITLE = 'CHANGE_TODO_TITLE';

const initialState = {
    todolists: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TODOLISTS:
            return {
                ...state,
                todolists: action.todolists.map(todo => {
                    return {
                        ...todo,
                        tasks: []
                    }
                })
            };
        case SET_TODOLISTS_TASKS:
            return {
                ...state,
                todolists: state.todolists.map (todo => {
                    if(todo.id !== action.todolistId) {
                        return todo
                    } else {
                        return {
                            ...todo,
                            tasks: action.task
                        }
                    }
                })
            };
        case CREATE_TODOLIST:
            return {
                ...state,
                todolists: [...state.todolists, action.newTodolist]
            };
        case CREATE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(todo => {
                        if (todo.id !== action.todolistId) {
                            return todo
                        } else {
                            return {
                                ...todo,
                                tasks: [...todo.tasks, action.newTask]
                            }
                        }
                    }
                )
            };
        case CHANGE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(todo => {
                    if (todo.id !== action.todolistId) {
                        return todo
                    } else {
                        return {
                            ...todo,
                            tasks: todo.tasks.map(task => {
                                if (task.id !== action.taskId) {
                                    return task
                                } else {
                                    return {
                                        ...task,
                                        ...action.obj
                                    }
                                }
                            })
                        }
                    }
                })
            };
        case CHANGE_TODO_TITLE:{
            return {
                ...state,
                todolists: state.todolists.map(todo => {
                    if(todo.id !== action.todolistId){
                        return todo
                    } else {
                        return {
                            ...todo,
                            title: action.title
                        }
                    }
                })
            }
        }
        case DELETE_TODO:
            return {
                ...state,
                todolists: state.todolists.filter(todo => todo.id !== action.todolistId)
            };
        case DELETE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(todo => {
                    if (todo.id !== action.todolistId) {
                        return todo
                    } else {
                        return {
                            ...todo,
                            tasks: todo.tasks.filter(t => t.id !== action.taskId)
                        }
                    }
                })
            }

    }
    return state;
};

export const createTodo = (newTodolist) => {
    return {
        type: CREATE_TODOLIST,
        newTodolist
    }
};

export const createTask = (newTask, todolistId) => {
    return {
        type: CREATE_TASK,
        newTask,
        todolistId
    }
};

export const updateTask = (taskId, obj, todolistId) => {
    return {
        type: CHANGE_TASK,
        taskId: taskId,
        obj: obj,
        todolistId: todolistId
    }
};

export const deleteTodo = (todolistId) => {
    return {
        type: DELETE_TODO,
        todolistId: todolistId
    }
};

export const deleteTask = (taskId, todolistId) => {
    return {
        type: DELETE_TASK,
        taskId: taskId,
        todolistId: todolistId
    }
};

export const setTodoList = (todolists) => {
    return {
        type: SET_TODOLISTS,
        todolists
    }
};

export const setTaskAC = (todolistId,task) => {
    return{
        type: SET_TODOLISTS_TASKS,
        todolistId,
        task
    }
};

export const changeTodoTitle =(todolistId,title) => {
    return {
        type: CHANGE_TODO_TITLE,
        todolistId,
        title
    }
};

export const createTodoList = (title) => (dispatch) => {
    api.createTodolist(title).then(response => {
        dispatch(createTodo(response.data.item))
    });
};

export const getTodoLists = () => (dispatch) => {
    api.getTodolist().then(response => {
        dispatch(setTodoList(response))
    });
};

export const getTodoTasks = (todoId) => (dispatch) => {
    api.getTasks(todoId).then(response => {
        dispatch(setTaskAC(todoId,response.items))})
};

export const addTask = (title,todoId) => (dispatch) => {
    api.addTask(title,todoId).then(response => {
        dispatch(createTask(response.data.item ,todoId))
    });
};

export const deleteTodoList = (todoId) => (dispatch) => {
    api.deleteTodo(todoId).then( () => {
        dispatch(deleteTodo(todoId))
    });
};

export const editTodoTitle = (todoId,title) => (dispatch) => {
    api.changeTodoTitle(todoId,title).then (() => {
        dispatch(changeTodoTitle(todoId,title))
    })
};

export const deleteTodoTask = (taskId,todoId) => (dispatch) => {
    api.deleteTask(todoId,taskId).then( () => {
        dispatch(deleteTask(taskId,todoId))
    });
};

export const changeTodoTask = (task,obj,todoId) => (dispatch) => {
    api.changeTask(task,obj,todoId).then( () => {
        dispatch(updateTask(task.id,obj,todoId))
    });
};




export default reducer