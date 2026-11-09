import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "./Header.tsx";
import { TodosContext } from "../contexts/todos.tsx";
import userEvent from "@testing-library/user-event";
import { createTestContextValue } from "../test-context.ts";
import { initialState } from "../contexts/todos.tsx";

describe("Header", () => {
  const mockDisptch = vi.fn();
  const mockAddTodo = vi.fn();
  it("renders default state", () => {
    render(
      <TodosContext.Provider
        value={createTestContextValue(initialState, mockDisptch, { addTodo: mockAddTodo })}
      >
        <Header />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should add a todo", async () => {
    const user = userEvent.setup();
    render(
      <TodosContext.Provider
        value={createTestContextValue(initialState, mockDisptch, { addTodo: mockAddTodo })}
      >
        <Header />
      </TodosContext.Provider>
    );
    const input = screen.getByTestId<HTMLInputElement>("newTodoInput");
    await user.type(input, "foo{enter}");
    expect(mockAddTodo).toHaveBeenCalledWith({
      text: "foo",
      isCompleted: false,
    });
    expect(input.value).toEqual("");
  });
});
