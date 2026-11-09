import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

export type Todo = {
  id: string;
  text: string;
  isCompleted: boolean;
};

export type NewTodo = Omit<Todo, "id">;
export type TodoFilter = "all" | "active" | "completed";

export type TodosState = {
  todos: Todo[];
  filter: TodoFilter;
};

export type TodosAction =
  | { type: "getTodos"; payload: Todo[] }
  | { type: "addTodo"; payload: Todo }
  | { type: "toggleAll"; payload: boolean }
  | { type: "updateTodo"; payload: Partial<Todo> & Pick<Todo, "id"> }
  | { type: "removeTodo"; payload: Todo["id"] }
  | { type: "changeFilter"; payload: TodoFilter };

export type TodosActions = {
  addTodo: (todo: NewTodo) => Promise<void>;
  updateTodo: (todoId: Todo["id"], fields: Partial<NewTodo>) => Promise<void>;
  removeTodo: (todoId: Todo["id"]) => Promise<void>;
  changeFilter: (filter: TodoFilter) => Promise<void>;
  toggleAll: (isCompleted: boolean) => Promise<void>;
};

export type TodosContextValue = [
  TodosState,
  Dispatch<TodosAction>,
  TodosActions,
];

export const initialState: TodosState = {
  todos: [],
  filter: "all",
};

export const reducer = (state: TodosState, action: TodosAction): TodosState => {
  switch (action.type) {
    case "getTodos": {
      return {
        ...state,
        todos: action.payload,
      };
    }
    case "addTodo": {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }
    case "toggleAll": {
      const updatedTodos = state.todos.map((todo) => ({
        ...todo,
        isCompleted: action.payload,
      }));
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case "updateTodo": {
      const updatedTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, ...action.payload };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case "removeTodo": {
      const updatedTodos = state.todos.filter(
        (todo) => todo.id !== action.payload
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case "changeFilter": {
      return {
        ...state,
        filter: action.payload,
      };
    }
    default:
      return state;
  }
};

export const changeFilter = async (
  dispatch: Dispatch<TodosAction>,
  filter: TodoFilter
) => {
  dispatch({
    type: "changeFilter",
    payload: filter,
  });
};

export const getTodos = async (dispatch: Dispatch<TodosAction>) => {
  const response = await axios.get("http://localhost:3004/todos");
  dispatch({
    type: "getTodos",
    payload: response.data,
  });
};

export const addTodo = async (
  dispatch: Dispatch<TodosAction>,
  todoToCreate: NewTodo
) => {
  const response = await axios.post(
    "http://localhost:3004/todos",
    todoToCreate
  );
  dispatch({
    type: "addTodo",
    payload: response.data,
  });
};

export const updateTodo = async (
  dispatch: Dispatch<TodosAction>,
  todoId: Todo["id"],
  fieldsToUpdate: Partial<NewTodo>
) => {
  const response = await axios.put(
    `http://localhost:3004/todos/${todoId}`,
    fieldsToUpdate
  );
  dispatch({
    type: "updateTodo",
    payload: response.data,
  });
};

export const removeTodo = async (
  dispatch: Dispatch<TodosAction>,
  todoId: Todo["id"]
) => {
  await axios.delete(`http://localhost:3004/todos/${todoId}`);
  dispatch({
    type: "removeTodo",
    payload: todoId,
  });
};

export const toggleAll = async (
  dispatch: Dispatch<TodosAction>,
  isCompleted: boolean,
  todos: Todo[]
) => {
  const promises = todos.map((todo) => {
    return axios.put(`http://localhost:3004/todos/${todo.id}`, {
      text: todo.text,
      isCompleted,
    });
  });
  await Promise.all(promises);
  dispatch({
    type: "toggleAll",
    payload: isCompleted,
  });
};

export const TodosContext = createContext<TodosContextValue | null>(null);

export const useTodosContext = (): TodosContextValue => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodosContext must be used within a TodosProvider");
  }
  return context;
};

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    getTodos(dispatch);
  }, []);

  return (
    <TodosContext.Provider
      value={[
        state,
        dispatch,
        {
          addTodo: (todoToCreate) => addTodo(dispatch, todoToCreate),
          updateTodo: (todoId, fieldsToUpdate) =>
            updateTodo(dispatch, todoId, fieldsToUpdate),
          removeTodo: (todoId) => removeTodo(dispatch, todoId),
          changeFilter: (filter) => changeFilter(dispatch, filter),
          toggleAll: (isCompleted) =>
            toggleAll(dispatch, isCompleted, state.todos),
        },
      ]}
    >
      {children}
    </TodosContext.Provider>
  );
};
