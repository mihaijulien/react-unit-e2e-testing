import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { useTodosContext, type Todo as TodoItem } from "../contexts/todos.tsx";

type TodoProps = {
  todo: TodoItem;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
};

const Todo = ({ todo, isEditing, setEditingId }: TodoProps) => {
  const editingClass = isEditing ? "editing" : "";
  const completedClass = todo.isCompleted ? "completed" : "";
  const [, , { updateTodo, removeTodo }] = useTodosContext();
  const [editText, setEditText] = useState(todo.text);
  const editInputEl = useRef<HTMLInputElement>(null);

  const setTodoInEditingMode = () => {
    setEditingId(todo.id);
  };
  const toggleTodo = () => {
    updateTodo(todo.id, {
      text: todo.text,
      isCompleted: !todo.isCompleted,
    });
  };
  const changeEditInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };
  const keyDownEditInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateTodo(todo.id, {
        text: event.currentTarget.value,
        isCompleted: todo.isCompleted,
      });
      setEditingId(null);
    }

    if (event.key === "Escape") {
      setEditText(todo.text);
      setEditingId(null);
    }
  };

  useEffect(() => {
    if (isEditing) {
      editInputEl.current?.focus();
    }
  });

  return (
    <li
      className={`${editingClass} ${completedClass}`}
      data-testid="todo"
      data-cy="todo"
    >
      <div className="view">
        <input
          className="toggle"
          data-testid="toggle"
          data-cy="todoCheckbox"
          type="checkbox"
          checked={todo.isCompleted}
          onChange={toggleTodo}
        />
        <label
          onDoubleClick={setTodoInEditingMode}
          data-testid="label"
          data-cy="todoLabel"
        >
          {todo.text}
        </label>
        <button
          className="destroy"
          onClick={() => removeTodo(todo.id)}
          data-testid="destroy"
          data-cy="destroy"
        />
      </div>
      {isEditing && (
        <input
          className="edit"
          data-testid="edit"
          data-cy="todoEdit"
          ref={editInputEl}
          value={editText}
          onChange={changeEditInput}
          onKeyDown={keyDownEditInput}
        />
      )}
    </li>
  );
};

export default Todo;
