import type { Dispatch } from "react";
import type {
  TodosAction,
  TodosActions,
  TodosContextValue,
  TodosState,
} from "./contexts/todos.tsx";

export const createTestContextValue = (
  state: TodosState,
  dispatch: Dispatch<TodosAction>,
  actions: Partial<TodosActions> = {}
): TodosContextValue => [
  state,
  dispatch,
  {
    addTodo: actions.addTodo ?? (async () => {}),
    updateTodo: actions.updateTodo ?? (async () => {}),
    removeTodo: actions.removeTodo ?? (async () => {}),
    changeFilter: actions.changeFilter ?? (async () => {}),
    toggleAll: actions.toggleAll ?? (async () => {}),
  },
];
