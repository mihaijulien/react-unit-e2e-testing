import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodosContext } from "../contexts/todos.tsx";
import type { Todo as TodoItem, TodosState } from "../contexts/todos.tsx";
import { createTestContextValue } from "../test-context.ts";
import Main from "./Main.tsx";
import userEvent from "@testing-library/user-event";

const mockTodo = vi.fn();
vi.mock("./Todo", () => {
  return {
    default: (props: {
      todo: TodoItem;
      isEditing: boolean;
      setEditingId: (id: string | null) => void;
    }) => {
      mockTodo(props);
      return <div>todo</div>;
    },
  };
});

describe("Main", () => {
  const mockDispatch = vi.fn();
  const mockToggleAll = vi.fn();
  it("should be hidden wehn no todos", () => {
    const state: TodosState = {
      todos: [],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={createTestContextValue(state, mockDispatch, { toggleAll: mockToggleAll })}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("main")).toHaveClass("hidden");
  });

  it("should be visible with todos", () => {
    const state: TodosState = {
      todos: [{ id: "1", text: "foo", isCompleted: false }],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={createTestContextValue(state, mockDispatch, { toggleAll: mockToggleAll })}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("main")).not.toHaveClass("hidden");
  });

  it("should render a list of todos", () => {
    const state: TodosState = {
      todos: [
        { id: "1", text: "foo", isCompleted: false },
        { id: "2", text: "bar", isCompleted: false },
      ],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={createTestContextValue(state, mockDispatch, { toggleAll: mockToggleAll })}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(mockTodo).toHaveBeenCalledTimes(2);
    expect(mockTodo).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        isEditing: false,
        todo: {
          id: "1",
          text: "foo",
          isCompleted: false,
        },
      })
    );
  });

  it("should hightlight toggle all checkbox", () => {
    const state: TodosState = {
      todos: [{ id: "1", text: "foo", isCompleted: true }],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={createTestContextValue(state, mockDispatch, { toggleAll: mockToggleAll })}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("toggleAll")).toBeChecked();
  });

  it("should toggle all todos", async () => {
    const user = userEvent.setup();
    const state: TodosState = {
      todos: [{ id: "1", text: "foo", isCompleted: true }],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={createTestContextValue(state, mockDispatch, { toggleAll: mockToggleAll })}
      >
        <Main />
      </TodosContext.Provider>
    );
    const toggleAll = screen.getByTestId("toggleAll");
    await user.click(toggleAll);
    expect(mockToggleAll).toHaveBeenCalledWith(false);
  });
});
