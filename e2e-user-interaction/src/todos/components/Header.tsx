import { useState, type ChangeEvent, type KeyboardEvent } from "react";

import { useTodosContext } from "../contexts/todos.tsx";

const Header = () => {
  const [text, setText] = useState("");
  const [, , { addTodo }] = useTodosContext();

  const changeText = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const keydownText = (event: KeyboardEvent<HTMLInputElement>) => {
    const isEnter = event.key === "Enter";
    const newText = text.trim();
    const isTextPresent = newText.length > 0;

    if (isEnter && isTextPresent) {
      addTodo({ text: newText, isCompleted: false });
      setText("");
    }
  };

  return (
    <header className="header" data-testid="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        data-testid="newTodoInput"
        data-cy="newTodoInput"
        value={text}
        onChange={changeText}
        onKeyDown={keydownText}
        autoFocus
      />
    </header>
  );
};

export default Header;
